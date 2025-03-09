import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'locations'].join('_');

  // Remove the incorrect constraint
  await query.removeConstraint(tableName, `${tableName}_ibfk_1`);

  // Add it again with the correct parameters
  await query.addConstraint(tableName, {
    name: `${tableName}_ibfk_1`,
    type: 'foreign key',
    fields: ['incidentId'],
    references: { table: [app.get('db_prefix'), 'incidents'].join('_'), field: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  const tableName = [app.get('db_prefix'), 'locations'].join('_');

  // Remove the correct constraint
  await query.removeConstraint(tableName, `${tableName}_ibfk_1`);

  // Add it again with the old, but incorrect parameters
  await query.addConstraint(tableName, {
    name: `${tableName}_ibfk_1`,
    type: 'foreign key',
    fields: ['incidentId'],
    references: { table: [app.get('db_prefix'), 'incidents'].join('_'), field: 'id' },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
};
