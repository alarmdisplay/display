// Initializes the `Calendar Feeds` service on path `/calendar-feeds`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CalendarFeeds } from './calendar-feeds.class';
import createModel from '../../models/calendar-feeds.model';
import hooks from './calendar-feeds.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'calendar-feeds': CalendarFeeds & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/calendar-feeds', new CalendarFeeds(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('calendar-feeds');

  service.hooks(hooks);
}
