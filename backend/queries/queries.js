import { QueryTypes } from 'sequelize';
import sequelize from '../models/sequelize.js';
import * as receivedVsProducedTrends from './receivedVsProducedTrend.js';
import * as productionTrends from './productionTrends.js';

const getReceivedVsProducedTrends = ({ branchId, year }) => {
  return sequelize
    .query(receivedVsProducedTrends.query, {
      type: QueryTypes.SELECT,
      replacements: { branchId, year },
    })
    .then(receivedVsProducedTrends.format);
};

const getProductionTrends = ({ branchId, year }) => {
  return sequelize.query(productionTrends.query, {
    type: QueryTypes.SELECT,
    replacements: { branchId, year },
  }).then(productionTrends.format);
};

export { getReceivedVsProducedTrends, getProductionTrends };
