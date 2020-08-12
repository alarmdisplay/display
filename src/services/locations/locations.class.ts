import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, LocationData } from '../../declarations';

export class Locations extends Service<LocationData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
