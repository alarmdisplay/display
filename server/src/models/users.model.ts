import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const User = sequelizeClient.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    tableName: [app.get('db_prefix'), 'users'].join('_')
  });
  return User;
}
