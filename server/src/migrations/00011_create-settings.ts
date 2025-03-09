import Sequelize, {DataTypes} from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'settings'].join('_');

  try {
    await query.describeTable(tableName);
    // Exit early if the table exists
    return;
  } catch {
    // The table does not exist, so we just continue
  }

  await query.createTable(tableName, {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: DataTypes.JSON,
      allowNull: true
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
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.dropTable([app.get('db_prefix'), 'settings'].join('_'));
};
