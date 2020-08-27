import {HookContext} from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function allowApiKey(options = {}) {
  return async (context: HookContext): Promise<HookContext> => {
    const { params } = context;

    // Stop, if it is an internal call or another authentication has been performed already
    if (!params.provider || params.authentication) {
      return context;
    }

    // Extract the API key from the request
    if(params.headers && params.headers['x-api-key']) {
      context.params = {
        ...params,
        authentication: {
          strategy: 'api-key',
          'api-key': params.headers['x-api-key']
        }
      };
    }

    return context;
  };
}
