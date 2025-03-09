import { Params, SetupMethod } from '@feathersjs/feathers';
import { Application } from '../../declarations';

interface StatusData {
  ready: boolean
}

export class Status implements SetupMethod {
  app: Application;
  databaseReady = false;

  constructor (app: Application) {
    this.app = app;
  }

  setup(app: Application) {
    // Since we cannot get the Promise's status, we have to set a local variable upon fulfilment
    (app.get('databaseReady') as Promise<void>).then(() => {
      this.databaseReady = true;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<StatusData> {
    return {
      ready: this.databaseReady
    };
  }
}
