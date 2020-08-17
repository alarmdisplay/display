import { SetupMethod } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import io from 'socket.io-client';
import logger from '../../logger';
import IncidentsWatcher from './services/incidents.class';
import LocationsWatcher from './services/locations.class';

interface ServiceOptions {}

export class HubConnector implements SetupMethod {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  setup(app: Application): void {
    const hubHost = app.get('hub_host');
    const hubApiKey = app.get('hub_api_key');

    // If no host is set, there is no intention to connect to the Hub
    if (!hubHost || hubHost === '' || hubHost === 'HUB_HOST') {
      return;
    }

    let hubUrl;
    try {
      hubUrl = new URL(hubHost);
    } catch (e) {
      logger.error('hub_host is not a valid URL');
      return;
    }

    if (!hubApiKey || hubApiKey === '' || hubApiKey === 'HUB_API_KEY') {
      logger.warn('hub_host is set, but hub_api_key is empty');
      return;
    }

    logger.info('Connecting to Hub at %s...', hubUrl.toString());
    const socket = io(hubUrl.toString(), {
      transportOptions: {
        polling: {
          extraHeaders: {
            'x-api-key': hubApiKey
          }
        }
      }
    });
    socket.on('connect', () => {
      logger.info('Connected to Hub');
    });
    socket.on('disconnect', (reason: Error) => {
      logger.error('Disconnected from Hub:', reason);
    });

    // Start watching services on the Hub
    new IncidentsWatcher(app, socket);
    new LocationsWatcher(app, socket);
  }
}
