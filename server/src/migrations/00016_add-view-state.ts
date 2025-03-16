import Sequelize from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  await query.addColumn([app.get('db_prefix'), 'views'].join('_'), 'active', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.removeColumn([app.get('db_prefix'), 'views'].join('_'), 'active');
};
