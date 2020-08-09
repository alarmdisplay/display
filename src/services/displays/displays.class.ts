import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, DisplayData } from '../../declarations';

export class Displays extends Service<DisplayData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
