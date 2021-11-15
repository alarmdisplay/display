import '@feathersjs/transport-commons';
import { HookContext } from '@feathersjs/feathers';
import { Application, KeyRequestData } from './declarations';
import { ApiKeyStrategy } from './auth-strategies/api-key.strategy';
import logger from './logger';

const pendingConnections = new Map<any, string>();

/**
 * Generate a random string of a certain length consisting of digits and uppercase letters.
 *
 * @param length The desired number of characters of the generated string.
 *
 * @return {string}
 */
function generateIdentifier (length: number) {
  if (!length || length < 0) {
    return '';
  }

  const availableCharacters = 'ABCDEFGHKLMNPRSTUVWXYZ123456789';
  let identifier = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * availableCharacters.length);
    identifier += availableCharacters[index];
  }

  return identifier;
}

/**
 * Returns the unique identifier that pending connections are given.
 *
 * @param connection
 *
 * @return {string | undefined} The identifier, or undefined if the connection is unknown
 */
function getIdentifierForConnection (connection: any): string | undefined {
  return pendingConnections.get(connection);
}

export { getIdentifierForConnection };

export default function(app: Application): void {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  const apiKeyStrategy = new ApiKeyStrategy;
  apiKeyStrategy.setApplication(app);

  app.on('connection', async (connection: any): Promise<void> => {
    // Accept authentication by API key on socket connection
    if (connection.headers && connection.headers['x-api-key']) {
      try {
        // Check if the API key is valid
        const authResult = await apiKeyStrategy.authenticate({
          strategy: 'api-key',
          'api-key': connection.headers['x-api-key']
        }, {});

        if (authResult['api-key']) {
          app.channel('authenticated').join(connection);
          const display = authResult.display;
          if (display) {
            logger.info('Display %s connected', display.name);
            app.channel(`displays/${display.id}`).join(connection);
          }
          return;
        }
      } catch (e) {
        logger.warn('Socket connected, API key not accepted:', e.message || e);
        // Create a unique identifier for this connection, that can be sent back upon a key request
        const identifier = generateIdentifier(6);
        pendingConnections.set(connection, identifier);
        app.channel(`connections/${identifier}`).join(connection);
      }
    }

    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult: any, { connection }: any): void => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if(connection) {
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);
    }
  });

  app.on('disconnect', async (connection: any): Promise<void> => {
    // If this was a pending connection, clean up
    if (pendingConnections.has(connection)) {
      const clientId = pendingConnections.get(connection);
      // Remove any key request, that came through this connection
      await app.service('api/v1/key-requests').remove(null, { query: { requestId: clientId } });
      pendingConnections.delete(connection);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.publish((data: any, hook: HookContext) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    logger.debug('Publishing all events to all authenticated users. See `channels.js` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line

    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated');
  });

  // Send the patched event only to the affected connection, because it contains the key
  app.service('api/v1/key-requests').publish('patched', (data: KeyRequestData) => {
    return [
      app.channel(`connections/${data.requestId}`)
    ];
  });

  // Send all other events about key requests also to the affected connection, not only the authenticated ones
  app.service('api/v1/key-requests').publish((data: KeyRequestData) => {
    return [
      app.channel('authenticated'),
      app.channel(`connections/${data.requestId}`)
    ];
  });
}
