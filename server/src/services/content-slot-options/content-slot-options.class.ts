import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ContentSlotOptionData } from '../../declarations';

export class ContentSlotOptions extends Service<ContentSlotOptionData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
