import GrainType from './GrainType.js';
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';


const DailyProduction = sequelize.define(
  'dailyProduction',
  {
    averageMoistureContent: {
      type: DataTypes.DECIMAL(4, 2),
    },
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
    status: {
      type: DataTypes.ENUM('produced', 'received', 'picked', 'shipped'),
      allowNull: false,
      defaultValue: 'produced'
    }
  },
  {
    createdAt: 'productionDate',
    updatedAt: 'dateUpdated',
    tableName: 'daily_production'
  }
);

GrainType.hasMany(DailyProduction, { foreignKey: { allowNull: false } });
DailyProduction.belongsTo(GrainType);


export default DailyProduction;
