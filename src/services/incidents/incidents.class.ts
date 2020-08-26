import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, IncidentData } from '../../declarations';

export class Incidents extends Service<IncidentData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
