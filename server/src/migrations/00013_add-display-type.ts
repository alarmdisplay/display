import Sequelize from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  await query.addColumn([app.get('db_prefix'), 'displays'].join('_'), 'type', {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'monitor'
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.removeColumn([app.get('db_prefix'), 'displays'].join('_'), 'type');
};
