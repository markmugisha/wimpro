import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import Batch from './Batch.js';

const BatchItem = sequelize.define(
  'batchItem',
  {
    numberOfBags: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weightPerBag: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.weightPerBag * this.numberOfBags;
      },
      set(value) {
        throw new Error('Do not try to set the `quantity` value!');
      },
    },
    stackNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstFumigationDate: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated',
    tableName: 'batch_item',
  }
);

Batch.hasMany(BatchItem, {
  foreignKey: { allowNull: false, name: 'batchNumber' },
  sourceKey: 'batchNumber',
});
BatchItem.belongsTo(Batch, {
  foreignKey: { allowNull: false, name: 'batchNumber' },
  targetKey: 'batchNumber',
});

export default BatchItem;
