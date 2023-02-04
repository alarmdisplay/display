import {DataTypes} from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'locations'].join('_');

  await query.renameColumn(tableName, 'locality', 'municipality');
  await query.addColumn(tableName, 'district', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'locations'].join('_');
  await query.removeColumn(tableName, 'district');
  await query.renameColumn(tableName, 'municipality', 'locality');
};
