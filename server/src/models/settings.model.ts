// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const Setting = sequelizeClient.define('setting', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    tableName: [app.get('db_prefix'), 'settings'].join('_')
  });
  return Setting;
}
