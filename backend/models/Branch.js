import DailyProduction from './DailyProduction.js';
import GrainType from './GrainType.js';
import ProductionInventory from './ProductionInventory.js';
import ReceivedProduct from './ReceivedProducts.js';
import Silo from './Silo.js';
import User from './User.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Branch = sequelize.define('branch', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cityOrTown: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(60),
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
  storageCapacity: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

Branch.belongsToMany(GrainType, { through: Silo });
GrainType.belongsToMany(Branch, { through: Silo });
Branch.hasMany(Silo);
Silo.belongsTo(Branch);
GrainType.hasMany(Silo);
Silo.belongsTo(GrainType);

Branch.belongsToMany(GrainType, { through: ProductionInventory });
GrainType.belongsToMany(Branch, { through: ProductionInventory });
Branch.hasMany(ProductionInventory);
ProductionInventory.belongsTo(Branch);
GrainType.hasMany(ProductionInventory);
ProductionInventory.belongsTo(GrainType);

Branch.hasMany(User);
User.belongsTo(Branch);

Branch.hasMany(ReceivedProduct, { foreignKey: { allowNull: false } });
ReceivedProduct.belongsTo(Branch);

Branch.hasMany(DailyProduction, { foreignKey: { allowNull: false } });
DailyProduction.belongsTo(Branch);

export default Branch;
