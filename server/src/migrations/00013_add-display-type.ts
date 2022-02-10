import Sequelize, {QueryInterface} from 'sequelize';
import {Application} from '../declarations';

export default {
  async up(query: QueryInterface, app: Application): Promise<void> {
    await query.addColumn([app.get('db_prefix'), 'displays'].join('_'), 'type', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'monitor'
    });
  },
  async down(query: QueryInterface, app: Application): Promise<void> {
    await query.removeColumn([app.get('db_prefix'), 'displays'].join('_'), 'type');
  }
};
