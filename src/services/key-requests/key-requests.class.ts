import { MemoryServiceOptions, Service } from 'feathers-memory';
import { Application, DisplayData, KeyRequestData } from '../../declarations';
import { NullableId, Params } from '@feathersjs/feathers';
import { getIdentifierForConnection } from '../../channels';
import { MethodNotAllowed } from '@feathersjs/errors';

export class KeyRequests extends Service<KeyRequestData> {
  private app: Application;
  constructor(options: Partial<MemoryServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  _create(data: Partial<KeyRequestData>, params?: Params): Promise<KeyRequestData[] | KeyRequestData> {
    if (!params?.connection) {
      throw new MethodNotAllowed('A key request can only be created by realtime connections');
    }

    // Every unauthenticated connection gets an identifier that can be used to identify its key request
    const identifier = getIdentifierForConnection(params.connection);
    if (!identifier) {
      throw new Error('Unknown connection');
    }
    data.requestId = identifier;

    // No request may be granted from the beginning
    data.granted = false;

    return super._create(data, params);
  }


  async _patch(id: NullableId, data: Partial<KeyRequestData>, params?: Params): Promise<KeyRequestData> {
    if (id === null) {
      throw new MethodNotAllowed('Can not patch multiple entries');
    }

    const existingRecord = await this.get(id);
    // If the key request gets granted, create an API key, connected to a new Display
    if (!existingRecord.granted && data.granted === true) {
      const newDisplay = await this.app.service('api/v1/displays').create({
        name: data.name || 'Neues Display',
        active: true
      }) as DisplayData;
      const newApiKey = await this.app.service('api/v1/api-keys').create({
        name: newDisplay.name,
        displayId: newDisplay.id
      });
      data.apiKey = `${newApiKey.id}:${newApiKey.token}`;
    }

    return await super._patch(id, data, params);
  }
}
