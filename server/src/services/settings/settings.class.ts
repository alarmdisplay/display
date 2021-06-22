import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, SettingsData } from '../../declarations';

export class Settings extends Service<SettingsData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
