import Sequelize, {DataTypes, QueryInterface} from 'sequelize';
import {Application} from '../declarations';

export default {
  async up(query: QueryInterface, app: Application): Promise<void> {
    const tableName = [app.get('db_prefix'), 'views'].join('_');

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
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      order: {
        type: DataTypes.MEDIUMINT,
        allowNull: false
      },
      columns: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      rows: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      displayId: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    await query.addIndex(tableName, {
      name: 'displayId',
      fields: ['displayId']
    });

    await query.addConstraint(tableName, {
      name: `${tableName}_ibfk_1`,
      type: 'foreign key',
      fields: ['displayId'],
      references: { table: [app.get('db_prefix'), 'displays'].join('_'), field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },
  async down(query: QueryInterface, app: Application): Promise<void> {
    await query.dropTable([app.get('db_prefix'), 'views'].join('_'));
  }
};
