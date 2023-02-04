import Sequelize, {DataTypes} from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'locations'].join('_');

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
    rawText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    hubLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    incidentId: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });

  await query.addIndex(tableName, {
    name: 'incidentId',
    fields: ['incidentId']
  });

  await query.addConstraint(tableName, {
    name: `${tableName}_ibfk_1`,
    type: 'foreign key',
    fields: ['incidentId'],
    references: { table: [app.get('db_prefix'), 'incidents'].join('_'), field: 'id' },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.dropTable([app.get('db_prefix'), 'locations'].join('_'));
};
