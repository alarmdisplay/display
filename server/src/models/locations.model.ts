import { Sequelize, DataTypes, Model } from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const locations = sequelizeClient.define('locations', {
    rawText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    municipality: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    hubLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    tableName: [app.get('db_prefix'), 'locations'].join('_')
  });

  (locations as any).associate = function (models: any): void {
    models.locations.belongsTo(models.incident);
  };

  return locations;
}
