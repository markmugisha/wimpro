import ReceivedProduct from './ReceivedProducts.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const GrainType = sequelize.define(
  'grainType',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
    tableName: 'grain_type',
  }
);

GrainType.hasMany(ReceivedProduct, { foreignKey: { allowNull: false } });
ReceivedProduct.belongsTo(GrainType);


export default GrainType;
