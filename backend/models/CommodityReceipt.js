import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';
const CommodityReceipt = sequelize.define(
  'commodityReceipt',
  {
    firstMass: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: false,
    },
    secondMass: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: true,
    },
    grossWeight: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: true,
    },
    deductions: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: true,
    },
    netWeight: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: true,
    },
  },
  {
    tableName: 'commodity_receipt',
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);

export default CommodityReceipt;
