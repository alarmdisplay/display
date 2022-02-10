import { Sequelize, DataTypes, Model } from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const Display = sequelizeClient.define('display', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'monitor'
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    tableName: [app.get('db_prefix'), 'displays'].join('_')
  });

  (Display as any).associate = function (models: any): void {
    models.display.hasMany(models.view, {
      foreignKey: { allowNull: false },
      as: 'views'
    });
    models.display.hasOne(models.api_key, {
      foreignKey: { allowNull: true },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Display;
}
