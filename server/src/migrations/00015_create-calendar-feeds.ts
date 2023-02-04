import Sequelize, {DataTypes} from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'calendar_feeds'].join('_');

  try {
    await query.describeTable(tableName);
    // Exit early if the table exists
    return;
  } catch (e) {
    // The table does not exist, so we just continue
  }

  await query.createTable(tableName, {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  await query.addConstraint(tableName, {
    name: 'name',
    type: 'unique',
    fields: ['name']
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.dropTable([app.get('db_prefix'), 'calendar_feeds'].join('_'));
};
