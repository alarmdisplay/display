import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, DisplayData } from '../../declarations';
import { Id, Params } from '@feathersjs/feathers';
import { Forbidden, NotAuthenticated } from '@feathersjs/errors';

export class Displays extends Service<DisplayData> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }

  get(id: Id, params?: Params): Promise<DisplayData> {
    // Enable a connected Display to retrieve its own record by using the ID 'self'
    if (id === 'self') {
      if (!params || !params.authenticated) {
        throw new NotAuthenticated();
      }

      if (!params.display || !params.display.id) {
        throw new Forbidden('Only a Display can query itself');
      }

      return super.get(params.display.id, params);
    }

    return super.get(id, params);
  }
}
