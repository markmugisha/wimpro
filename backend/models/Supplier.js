import ReceivedProduct from './ReceivedProducts.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Supplier = sequelize.define(
  'supplier',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);

Supplier.hasMany(ReceivedProduct, { foreignKey: { allowNull: false } });
ReceivedProduct.belongsTo(Supplier);

export default Supplier;
