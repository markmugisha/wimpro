import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const ProductionInventory = sequelize.define(
  'productionInventory',
  {
    total: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: true,
    },
  },
  {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
    tableName: 'production_inventory'
  }
);

export default ProductionInventory;
