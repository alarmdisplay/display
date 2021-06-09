import Sequelize, {QueryInterface} from 'sequelize';
import {Application} from '../declarations';

export default {
  async up(query: QueryInterface, app: Application): Promise<void> {
    await query.changeColumn([app.get('db_prefix'), 'incidents'].join('_'), 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: ''
    });
  },
  async down(query: QueryInterface, app: Application): Promise<void> {
    await query.changeColumn([app.get('db_prefix'), 'incidents'].join('_'), 'description', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });
  }
};
