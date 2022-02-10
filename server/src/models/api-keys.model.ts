import { Sequelize, DataTypes, Model } from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const ApiKey = sequelizeClient.define('api_key', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    tableName: [app.get('db_prefix'), 'api_keys'].join('_')
  });

  (ApiKey as any).associate = function (models: any): void {
    models.api_key.belongsTo(models.display);
  };

  return ApiKey;
}
