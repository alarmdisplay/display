import Sequelize from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  await query.addColumn('views', 'pinned', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.removeColumn('views', 'pinned');
};
