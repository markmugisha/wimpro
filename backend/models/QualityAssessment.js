import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';
import ReceivedProducts from './ReceivedProducts.js';

const QAData = sequelize.define(
  'qaData',
  {
    moistureContent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    ppb: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    ppm: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    ddn: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    coloration: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    insectOrvermin: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    brokenGrain: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    immatureShrivelled: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    rottenOrDiseased: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    organicMatter: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    inorganicMatter: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    filth: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    contrastingVarieties: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    pesticideResidues: {
      type: DataTypes.DECIMAL(4, 3),
      allowNull: true,
    },
    heatDamaged: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    tableName: 'qa_data',
  }
);

export default QAData;
