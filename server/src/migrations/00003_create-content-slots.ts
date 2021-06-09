import Sequelize, {DataTypes, QueryInterface} from 'sequelize';
import {Application} from '../declarations';

export default {
  async up(query: QueryInterface, app: Application): Promise<void> {
    const tableName = [app.get('db_prefix'), 'content_slots'].join('_');

    try {
      await query.describeTable(tableName);
      // Exit early if the table exists
      return;
    } catch (e) {
      // The table does not exist, so we just continue
    }

    await query.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      component: {
        type: DataTypes.STRING,
        allowNull: false
      },
      columnStart: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      columnEnd: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      rowStart: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      rowEnd: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      viewId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });

    await query.addIndex(tableName, {
      name: 'viewId',
      fields: ['viewId']
    });

    await query.addConstraint(tableName, {
      name: `${tableName}_ibfk_1`,
      type: 'foreign key',
      fields: ['viewId'],
      references: { table: [app.get('db_prefix'), 'views'].join('_'), field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },
  async down(query: QueryInterface, app: Application): Promise<void> {
    await query.dropTable([app.get('db_prefix'), 'content_slots'].join('_'));
  }
};
