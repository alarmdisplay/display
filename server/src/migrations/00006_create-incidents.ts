import Sequelize, {DataTypes} from 'sequelize';
import { Migration } from '../sequelize';

export const up: Migration = async ({context: {app, query}}) => {
  await query.createTable([app.get('db_prefix'), 'incidents'].join('_'), {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    ref: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    caller_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    caller_number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Actual', 'Exercise', 'Test'],
      allowNull: false,
      defaultValue: 'Actual'
    },
    category: {
      type: DataTypes.ENUM,
      values: ['Geo', 'Met', 'Safety', 'Security', 'Rescue', 'Fire', 'Health', 'Env', 'Transport', 'Infra', 'CBRNE', 'Other'],
      allowNull: false,
      defaultValue: 'Other'
    },
    hubIncidentId: {
      type: DataTypes.INTEGER,
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
  await query.dropTable([app.get('db_prefix'), 'incidents'].join('_'));
};
