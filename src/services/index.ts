import { Application } from '../declarations';
import users from './users/users.service';
import incidents from './incidents/incidents.service';
import displays from './displays/displays.service';
import apiKeys from './api-keys/api-keys.service';
import views from './views/views.service';
import contentSlots from './content-slots/content-slots.service';
import locations from './locations/locations.service';
import contentSlotOptions from './content-slot-options/content-slot-options.service';
import announcements from './announcements/announcements.service';
import hubConnector from './hub-connector/hub-connector.service';
import keyRequests from './key-requests/key-requests.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(incidents);
  app.configure(displays);
  app.configure(apiKeys);
  app.configure(views);
  app.configure(contentSlots);
  app.configure(locations);
  app.configure(contentSlotOptions);
  app.configure(announcements);
  app.configure(hubConnector);
  app.configure(keyRequests);
}
