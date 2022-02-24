import {DataTypes, QueryInterface} from 'sequelize';
import {Application} from '../declarations';

export default {
  async up(query: QueryInterface, app: Application): Promise<void> {
    const tableName = [app.get('db_prefix'), 'locations'].join('_');

    await query.renameColumn(tableName, 'locality', 'municipality');
    await query.addColumn(tableName, 'district', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    });
  },
  async down(query: QueryInterface, app: Application): Promise<void> {
    const tableName = [app.get('db_prefix'), 'locations'].join('_');
    await query.removeColumn(tableName, 'district');
    await query.renameColumn(tableName, 'municipality', 'locality');
  }
};
