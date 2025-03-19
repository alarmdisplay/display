import Sequelize from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  await query.addColumn('displays', 'type', {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'monitor'
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.removeColumn('displays', 'type');
};
