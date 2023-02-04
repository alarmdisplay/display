import Sequelize, {DataTypes} from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'api_keys'].join('_');

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
    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    displayId: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });

  await query.addIndex(tableName, {
    name: 'displayId',
    fields: ['displayId']
  });

  await query.addConstraint(tableName, {
    name: `${tableName}_ibfk_1`,
    type: 'foreign key',
    fields: ['displayId'],
    references: { table: [app.get('db_prefix'), 'displays'].join('_'), field: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.dropTable([app.get('db_prefix'), 'api_keys'].join('_'));
};
