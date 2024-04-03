import Branch from './Branch.js';
import GrainType from './GrainType.js';
import Order from './Order.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const OrderItem = sequelize.define(
  'orderItem',
  {
    numberOfBags: {
      type: DataTypes.INTEGER,
    },
    weightPerBag: {
      type: DataTypes.INTEGER,
    },
    totalWeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
    tableName: 'order_item'
  }
);

GrainType.hasMany(OrderItem, { foreignKey: { allowNull: false } });
OrderItem.belongsTo(GrainType);

Order.OrderItems = Order.hasMany(OrderItem, { foreignKey: { allowNull: false } });
OrderItem.belongsTo(Order);

export default OrderItem;
