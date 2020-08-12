import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const contentSlotOptions = sequelizeClient.define('content_slot_options', {
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      }
    },
    tableName: [app.get('db_prefix'), 'content_slot_options'].join('_')
  });

  (contentSlotOptions as any).associate = function (models: any): void {
    models.content_slot_options.belongsTo(models.content_slot, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return contentSlotOptions;
}
