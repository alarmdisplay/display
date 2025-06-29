// Initializes the `announcements` service on path `/announcements`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Announcements } from './announcements.class';
import createModel from '../../models/announcements.model';
import hooks from './announcements.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'announcements': Announcements & ServiceAddons<any>;
  }

  interface AnnouncementData {
    id: number
    title: string
    body?: string
    important: boolean
    validFrom?: Date
    validTo?: Date
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/announcements', new Announcements(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('announcements');

  service.hooks(hooks);
}
