import { Sequelize, DataTypes, Model } from 'sequelize';
import { HookReturn } from 'sequelize/types/hooks';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const View = sequelizeClient.define('view', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    columns: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    rows: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1
      }
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    tableName: [app.get('db_prefix'), 'views'].join('_')
  });

  (View as any).associate = function (models: any): void {
    models.view.belongsTo(models.display, {
      as: 'display'
    });
    models.view.hasMany(models.content_slot, {
      foreignKey: { allowNull: false },
      as: 'contentSlots'
    });
  };

  return View;
}
