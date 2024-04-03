import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Role = sequelize.define('role', {
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(['agripoint', 'warehouse', 'organization', 'grain_council']),
    allowNull: false,
  },
});

export default Role;
