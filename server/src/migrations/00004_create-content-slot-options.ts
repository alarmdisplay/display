import Sequelize, {DataTypes} from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'content_slot_options'].join('_');

  try {
    await query.describeTable(tableName);
    // Exit early if the table exists
    return;
  } catch {
    // The table does not exist, so we just continue
  }

  await query.createTable(tableName, {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
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
    },
    contentSlotId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  await query.addIndex(tableName, {
    name: 'contentSlotId',
    fields: ['contentSlotId']
  });

  await query.addConstraint(tableName, {
    name: `${tableName}_ibfk_1`,
    type: 'foreign key',
    fields: ['contentSlotId'],
    references: { table: [app.get('db_prefix'), 'content_slots'].join('_'), field: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.dropTable([app.get('db_prefix'), 'content_slot_options'].join('_'));
};
