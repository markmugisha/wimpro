import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import BatchItem from './BatchItem.js';

const Fumigation = sequelize.define(
  'fumigation',
  {
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    dosage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { updatedAt: 'dateUpdated' }
);

BatchItem.hasMany(Fumigation, {
  foreignKey: { allowNull: false },
});

Fumigation.belongsTo(BatchItem, {
  foreignKey: { allowNull: false },
});

export default Fumigation;
