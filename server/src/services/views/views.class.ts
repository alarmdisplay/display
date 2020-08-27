import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ViewData } from '../../declarations';

export class Views extends Service<ViewData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
