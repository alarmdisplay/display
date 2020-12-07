import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const Incident = sequelizeClient.define('incident', {
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
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    tableName: [app.get('db_prefix'), 'incidents'].join('_')
  });

  (Incident as any).associate = function (models: any): void {
    models.incident.hasOne(models.locations, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Incident;
}
