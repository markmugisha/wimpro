import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';
import { customAlphabet } from 'nanoid';
import CommodityReceipt from './CommodityReceipt.js';
import QAData from './QualityAssessment.js';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

const ReceivedProduct = sequelize.define(
  'receivedProduct',
  {
    lotId: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: nanoid,
      unique: true,
    },
    // productSupplyType: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    cityOrDistrict: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    driverId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'received',
        'weighed-first',
        'assessed',
        'weighed-final'
      ),
      defaultValue: 'received',
      allowNull: false,
    },
  },
  {
    tableName: 'received_product',
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);
ReceivedProduct.hasOne(CommodityReceipt, {
  foreignKey: { allowNull: false, name: 'lotId' },
  sourceKey: 'lotId',
});
CommodityReceipt.belongsTo(ReceivedProduct, {
  foreignKey: { allowNull: false, name: 'lotId' },
  targetKey: 'lotId',
});

ReceivedProduct.hasOne(QAData, {
  foreignKey: { allowNull: false, name: 'lotId' },
  sourceKey: 'lotId',
});
QAData.belongsTo(ReceivedProduct, {
  foreignKey: { allowNull: false, name: 'lotId' },
  targetKey: 'lotId',
});

export default ReceivedProduct;
