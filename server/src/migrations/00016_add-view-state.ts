import Sequelize from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {query}}) => {
  await query.addColumn('views', 'active', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  });
};
export const down: Migration = async ({context: {query}}) => {
  await query.removeColumn('views', 'active');
};
