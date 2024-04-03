import Branch from './Branch.js';
import GrainType from './GrainType.js';
import Supplier from './Supplier.js';
import User from './User.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Organization = sequelize.define('organization', {
  // accountId: {
  //   type: DataTypes.STRING(15),
  //   allowNull: false,
  // },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
});

Organization.hasMany(GrainType, { foreignKey: { allowNull: false } });
GrainType.belongsTo(Organization);

Organization.hasMany(User, {
  foreignKey: { allowNull: false },
});
User.belongsTo(Organization, { foreignKey: { allowNull: false } });

Organization.hasMany(Supplier, { foreignKey: { allowNull: false } });
Supplier.belongsTo(Organization);

Organization.hasMany(Branch, { foreignKey: { allowNull: false } });
Branch.belongsTo(Organization);

export default Organization;
