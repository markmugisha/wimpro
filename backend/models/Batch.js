import Branch from './Branch.js';
import DailyProduction from './DailyProduction.js';
import GrainType from './GrainType.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const Batch = sequelize.define('batch', {
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {createdAt: 'dateCreated',
updatedAt: 'dateUpdated',});

GrainType.hasMany(Batch, { foreignKey: { allowNull: false } });
Batch.belongsTo(GrainType);

Branch.hasMany(Batch, {foreignKey: {allowNull: false}});
Batch.belongsTo(Branch);

Batch.hasMany(DailyProduction, {
  foreignKey: { allowNull: false, name: 'batchNumber' },
  sourceKey: 'batchNumber',
});
DailyProduction.belongsTo(Batch, {
  foreignKey: { allowNull: false, name: 'batchNumber' },
  targetKey: 'batchNumber',
});

export default Batch;