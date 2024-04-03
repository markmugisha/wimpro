import GrainType from './GrainType.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Silo = sequelize.define(
  'silo',
  {
    total: {
      type: DataTypes.DECIMAL(17, 2),
      allowNull: true,
    },
  },
  {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
  }
);

// Silo.hasMany(GrainType);
// GrainType.belongsTo(Silo);

export default Silo;

// A GrainType belongs to a Silo
// A Silo belongs to a Branch
// Ergo, a GrainType belongs to a Branch

// A GrainType belongs to an Organization
