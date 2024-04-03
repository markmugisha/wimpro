import DailyProduction from './DailyProduction.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';


const ReceivedStock = sequelize.define(
  'receivedStock',
  {
    binNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stackNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstFumigationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }
  },
  {
    createdAt: 'receivedStockDate',
    updatedAt: 'dateUpdated',
    tableName: 'received_stock'
  }
);

DailyProduction.hasOne(ReceivedStock, {foreignKey: {allowNull: false}});
ReceivedStock.belongsTo(DailyProduction);


export default ReceivedStock;
