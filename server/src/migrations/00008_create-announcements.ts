import Sequelize, {DataTypes} from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  await query.createTable([app.get('db_prefix'), 'announcements'].join('_'), {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: true
    },
    important: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
};
export const down: Migration = async ({context: {app, query}}) => {
  await query.dropTable([app.get('db_prefix'), 'announcements'].join('_'));
};
