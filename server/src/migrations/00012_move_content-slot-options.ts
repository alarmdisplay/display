import Sequelize, { DataTypes } from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  const contentSlotsTableName = 'content_slots';
  await query.addColumn(contentSlotsTableName, 'options', {
    type: DataTypes.JSON,
    allowNull: true
  });

  const optionsTableName = 'content_slot_options';

  const oldOptions = await query.select(null, optionsTableName) as { id: number, key: string, value: string, contentSlotId: number }[];
  const newOptions = new Map<number, any>();
  for (const oldOption of oldOptions) {
    if (!newOptions.has(oldOption.contentSlotId)) {
      newOptions.set(oldOption.contentSlotId, {});
    }

    const options = newOptions.get(oldOption.contentSlotId);
    options[oldOption.key] = oldOption.value;
  }
  for (const entry of newOptions.entries()) {
    await query.bulkUpdate(contentSlotsTableName, { options: JSON.stringify(entry[1]) }, { id: entry[0] });
  }

  await query.dropTable(optionsTableName);
};
export const down: Migration = async ({context: {app, query}}) => {
  const tableName = 'content_slot_options';
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
    references: { table: 'content_slots', field: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // no data migration for now

  const contentSlotsTableName = 'content_slots';
  await query.removeColumn(contentSlotsTableName, 'options');
};
