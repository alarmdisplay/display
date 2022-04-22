// Initializes the `Calendar Items` service on path `/calendar-items`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CalendarItems } from './calendar-items.class';
import hooks from './calendar-items.hooks';
import { MemoryServiceOptions } from 'feathers-memory';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'calendar-items': CalendarItems & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options: Partial<MemoryServiceOptions> = {
    id: 'uid',
    paginate: app.get('paginate'),
    events: ['bulk-change'],
  };

  // Initialize our service with any options it requires
  app.use('/calendar-items', new CalendarItems(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('calendar-items');

  service.hooks(hooks);
}
