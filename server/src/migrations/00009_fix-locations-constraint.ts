import {QueryInterface} from 'sequelize';
import {Application} from '../declarations';

export default {
  async up(query: QueryInterface, app: Application): Promise<void> {
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
  },
  async down(query: QueryInterface, app: Application): Promise<void> {
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
  }
};
