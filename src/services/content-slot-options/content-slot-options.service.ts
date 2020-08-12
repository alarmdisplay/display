// Initializes the `content-slot-options` service on path `/api/v1/content-slot-options`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ContentSlotOptions } from './content-slot-options.class';
import createModel from '../../models/content-slot-options.model';
import hooks from './content-slot-options.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/content-slot-options': ContentSlotOptions & ServiceAddons<any>;
  }

  interface ContentSlotOptionData {
    id: number
    key: string
    value: string
    contentSlotId: number
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/content-slot-options', new ContentSlotOptions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/content-slot-options');

  service.hooks(hooks);
}
