import { AuthenticationBaseStrategy, AuthenticationRequest, AuthenticationResult } from '@feathersjs/authentication';
import { Params } from '@feathersjs/feathers';
import { NotAuthenticated } from '@feathersjs/errors';
import bcrypt from 'bcryptjs';

export class ApiKeyStrategy extends AuthenticationBaseStrategy {
  /**
   * Authenticate
   * @param authentication
   * @param params
   */
  async authenticate(authentication: AuthenticationRequest, params: Params): Promise<AuthenticationResult> {
    if (authentication.strategy !== 'api-key') {
      throw new Error(`Cannot handle authentication strategy ${authentication.strategy}`);
    }

    const apiKey = authentication['api-key'];
    if (!apiKey || apiKey === '') {
      throw new NotAuthenticated('No API key provided');
    }

    const match = apiKey.match(/^(\d+):(\w{64})$/);
    if (!match) {
      // The API key does not have the expected format
      throw new NotAuthenticated('API key invalid');
    }
    const [,id,token] = match;

    // Get the API key object for the given ID
    if (!this.app) {
      throw new Error('Cannot access main application');
    }
    const ApiKeyService = this.app.service('api/v1/api-keys');
    let storedApiKey;
    try {
      storedApiKey = await ApiKeyService.get(id);
    } catch {
      // No API key with that ID found
      throw new NotAuthenticated('API key invalid');
    }

    // Compare the submitted token to its hashed version in the database
    if (!await bcrypt.compare(token, storedApiKey.tokenHash)) {
      throw new NotAuthenticated('API key invalid');
    }

    const result = {
      'api-key': true,
      display: undefined
    };

    // If the API key belongs to a Display
    if (storedApiKey.displayId) {
      const DisplayService = this.app.service('api/v1/displays');
      try {
        result.display = await DisplayService.get(storedApiKey.displayId, params);
      } catch {
      }
    }

    return result;
  }
}
