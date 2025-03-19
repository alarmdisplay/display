import Sequelize from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  await query.changeColumn('incidents', 'description', {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: ''
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.changeColumn('incidents', 'description', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  });
};
