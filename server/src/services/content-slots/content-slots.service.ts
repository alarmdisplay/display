// Initializes the `content-slots` service on path `/api/v1/content-slots`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ContentSlots } from './content-slots.class';
import createModel from '../../models/content-slots.model';
import hooks from './content-slots.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/content-slots': ContentSlots & ServiceAddons<any>;
  }

  interface ContentSlotData {
    id: number
    component: string
    columnStart: number
    columnEnd: number
    rowStart: number
    rowEnd: number
    viewId: number
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    multi: ['remove'],
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/content-slots', new ContentSlots(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/content-slots');

  service.hooks(hooks);
}
