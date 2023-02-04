import Sequelize from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  await query.changeColumn([app.get('db_prefix'), 'incidents'].join('_'), 'description', {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: ''
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.changeColumn([app.get('db_prefix'), 'incidents'].join('_'), 'description', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  });
};
