import Branch from './Branch.js';
import GrainType from './GrainType.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Order = sequelize.define(
  'order',
  {
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    dispatchType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    receiptNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'canceled', 'fulfilled'),
      defaultValue: 'pending'
    }
  },
  {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);

Branch.hasMany(Order, { foreignKey: { allowNull: false } });
Order.belongsTo(Branch);

export default Order;
