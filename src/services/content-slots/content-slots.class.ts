import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ContentSlotData } from '../../declarations';

export class ContentSlots extends Service<ContentSlotData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
