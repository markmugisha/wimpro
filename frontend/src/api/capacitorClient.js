import { CapacitorHttp } from '@capacitor/core';

const createEndpointFunction = (baseUrl) => (endpoint) =>
  `${baseUrl}${endpoint}`;
const endpoint = createEndpointFunction('https://wimpro.app');

// This extracts data from the response received from the server.
const getDataFromResponse = (response) => {
  if (response.status >= 400) {
    throw new Error(response.data);
  }
  return response.data;
};

const createOrganization = ({ organization, admin }) => {
  return CapacitorHttp.post({
    url: endpoint('/create-organization'),
    data: { organization, admin },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};
const createUser = (user) => {
  return CapacitorHttp.post({
    url: endpoint('/create-user'),
    data: user,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const createWarehouse = (warehouse) => {
  return CapacitorHttp.post({
    url: endpoint('/create-warehouse'),
    data: warehouse,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};
const createSupplier = (supplier) => {
  return CapacitorHttp.post({
    url: endpoint('/create-supplier'),
    data: supplier,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const createGrainType = (grainType) => {
  return CapacitorHttp.post({
    url: endpoint('/create-graintype'),
    data: grainType,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const createBatch = (batch) => {
  return CapacitorHttp.post({
    url: endpoint('/batch'),
    data: batch,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const logIn = ({ email, password }) => {
  return CapacitorHttp.post({
    url: endpoint('/login'),
    data: { email, password },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const logOut = () => {
  return CapacitorHttp.post({
    url: endpoint('/logout'),
  }).then(getDataFromResponse);
};

const receiveProducts = (produce) => {
  return CapacitorHttp.post({
    url: endpoint('/add-received-produce'),
    data: produce,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const verifyCurrentUser = (token) => {
  return CapacitorHttp.post({
    url: endpoint(`/verify/${token}`),
  }).then(getDataFromResponse);
};

const createQaData = (qualityData) => {
  return CapacitorHttp.post({
    url: endpoint('/qa-data'),
    data: qualityData,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const updateQaData = (id, qualityData) => {
  return CapacitorHttp.put({
    url: endpoint(`/qa-data/${id}`),
    data: qualityData,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const addFirstMass = (data) => {
  return CapacitorHttp.post({
    url: endpoint('/first-mass'),
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const addSecondMass = (data) => {
  return CapacitorHttp.post({
    url: endpoint('/second-mass'),
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const addDailyProduction = (data) => {
  return CapacitorHttp.post({
    url: endpoint('/daily-production'),
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};
const addOrder = (data) => {
  return CapacitorHttp.post({
    url: endpoint('/order'),
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const addReceivedStock = (data) => {
  return CapacitorHttp.post({
    url: endpoint('/received-stock'),
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const createFumigation = (data) => {
  return CapacitorHttp.post({
    url: endpoint('.fumigation'),
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const pickOrder = (orderId) => {
  return CapacitorHttp.post({
    url: endpoint(`/pick-order/${orderId}`),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(getDataFromResponse);
};

const getCurrentUser = () => {
  return CapacitorHttp.get({
    url: endpoint('/current-user'),
  }).then(getDataFromResponse);
};
const getBranches = () => {
  return CapacitorHttp.get({
    url: endpoint('/branches'),
  }).then(getDataFromResponse);
};

const getSuppliers = () => {
  return CapacitorHttp.get({
    url: endpoint('/suppliers'),
  }).then(getDataFromResponse);
};

const getGrainTypes = () => {
  return CapacitorHttp.get({
    url: endpoint('/grain-types'),
  }).then(getDataFromResponse);
};

const getReceivedProduce = () => {
  return CapacitorHttp.get({
    url: endpoint('/received-produced'),
  }).then(getDataFromResponse);
};

const getUserAccounts = () => {
  return CapacitorHttp.get({
    url: endpoint('/user-account'),
  }).then(getDataFromResponse);
};

const getPendingFirstMass = () => {
  return CapacitorHttp.get({
    url: endpoint('/pending-first-mass'),
  }).then(getDataFromResponse);
};

const getPendingSecondMass = () => {
  return CapacitorHttp.get({
    url: endpoint('/pending-second-mass'),
  }).then(getDataFromResponse);
};
const getPendingQA = () => {
  return CapacitorHttp.get({
    url: endpoint('/pending-qa'),
  }).then(getDataFromResponse);
};

const getCommodityReceipts = () => {
  return CapacitorHttp.get({
    url: endpoint('/commodity-receipts'),
  }).then(getDataFromResponse);
};

const getReceivedProduceTrends = (year) => {
  return CapacitorHttp.get({
    url: endpoint('/received-produce-trends'),
    params: { year },
  }).then(getDataFromResponse);
};

const getSilos = () => {
  return CapacitorHttp.get({
    url: endpoint('/silos'),
  }).then(getDataFromResponse);
};
const getDailyProduction = () => {
  return CapacitorHttp.get({
    url: endpoint('/daily-production'),
  }).then(getDataFromResponse);
};

const getReceivedVsProducedTrend = (year) => {
  return CapacitorHttp.get({
    url: endpoint('/received-vs-produced-trend'),
    params: { year },
  }).then(getDataFromResponse);
};

const getProductionTrends = (year) => {
  return CapacitorHttp.get({
    url: endpoint('/production-trends'),
    param: { year },
  }).then(getDataFromResponse);
};

const getStockIn = () => {
  return CapacitorHttp.get({
    url: endpoint('/stock-in'),
  }).then(getDataFromResponse);
};

const getStock = () => {
  return CapacitorHttp.get({
    url: endpoint('/stock'),
  }).then(getDataFromResponse);
};

const getStockOut = () => {
  return CapacitorHttp.get({
    url: endpoint('/stock-out'),
  }).then(getDataFromResponse);
};

const getOrders = () => {
  return CapacitorHttp.get({
    url: endpoint('/order'),
  }).then(getDataFromResponse);
};

const getPendingOrders = () => {
  return CapacitorHttp.get({
    url: endpoint('/pending-orders'),
  }).then(getDataFromResponse);
};

const getBatches = () => {
  return CapacitorHttp.get({
    url: endpoint('/batches'),
  }).then(getDataFromResponse);
};

const getOrderPickingPlan = (orderId) => {
  return CapacitorHttp.get({
    url: endpoint(`/order-picking-plan/${orderId}`),
  }).then(getDataFromResponse);
};

export {
  createOrganization,
  logIn,
  logOut,
  verifyCurrentUser,
  receiveProducts,
  createUser,
  createWarehouse,
  createGrainType,
  createSupplier,
  createQaData,
  createBatch,
  createFumigation,
  addFirstMass,
  addSecondMass,
  addDailyProduction,
  addOrder,
  addReceivedStock,
  updateQaData,
  pickOrder,
  getBranches,
  getCurrentUser,
  getSuppliers,
  getGrainTypes,
  getReceivedProduce,
  getPendingFirstMass,
  getPendingSecondMass,
  getPendingQA,
  getCommodityReceipts,
  getSilos,
  getReceivedProduceTrends,
  getDailyProduction,
  getReceivedVsProducedTrend,
  getProductionTrends,
  getUserAccounts,
  getStockIn,
  getStock,
  getStockOut,
  getOrders,
  getBatches,
  getPendingOrders,
  getOrderPickingPlan,
};
