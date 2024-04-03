import axios, { AxiosError } from 'axios';

// Creating an Axios Instance:all requests made through this instance will have this URL as the prefix
const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:8000'
      : '',
  withCredentials: true,
});

// This extracts data from the response received from the server.
const getDataFromResponse = (response) => response.data;

const formatError = (error) => {
  if (error instanceof AxiosError && error.response) {
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error);
  // } else if (error.request) {
  //   // The request was made but no response was received
  //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //   // http.ClientRequest in node.js
  //   console.log(error.request);
  // } else {
  //   // Something happened in setting up the request that triggered an Error
  //   console.log('Error', error.message);
  // }
  // console.log(error.config)
};

const createOrganization = ({ organization, admin }) => {
  return apiClient
    .post('/create-organization', { organization, admin })
    .then(getDataFromResponse)
    .catch(formatError);
};
const createUser = (user) => {
  return apiClient
    .post('/create-user', user)
    .then(getDataFromResponse)
    .catch(formatError);
};

const createWarehouse = (warehouse) => {
  return apiClient
    .post('/create-warehouse', warehouse)
    .then(getDataFromResponse)
    .catch(formatError);
};
const createSupplier = (supplier) => {
  return apiClient
    .post('/create-supplier', supplier)
    .then(getDataFromResponse)
    .catch(formatError);
};
const createGrainType = (grainType) => {
  return apiClient
    .post('/create-graintype', grainType)
    .then(getDataFromResponse)
    .catch(formatError);
};

const createBatch = (batch) => {
  return apiClient
    .post('/batch', batch)
    .then(getDataFromResponse)
    .catch(formatError);
};

const logIn = ({ email, password }) => {
  return apiClient
    .post('/login', { email, password })
    .then(getDataFromResponse)
    .catch(formatError);
};

const logOut = () => {
  return apiClient.post('/logout').then(getDataFromResponse).catch(formatError);
};

const receiveProducts = (produce) => {
  return apiClient
    .post('/add-received-produce', produce)
    .then(getDataFromResponse)
    .catch(formatError);
};

const verifyCurrentUser = (token) => {
  return apiClient
    .post(`/verify/${token}`)
    .then(getDataFromResponse)
    .catch(formatError);
};

const createQaData = (qualityData) => {
  return apiClient
    .post('/qa-data', qualityData)
    .then(getDataFromResponse)
    .catch(formatError);
};

const updateQaData = (id, qualityData) => {
  return apiClient
    .put(`/qa-data/${id}`, qualityData)
    .then(getDataFromResponse)
    .catch(formatError);
};

const addFirstMass = (data) => {
  return apiClient
    .post('/first-mass', data)
    .then(getDataFromResponse)
    .catch(formatError);
};

const addSecondMass = (data) => {
  return apiClient
    .post('/second-mass', data)
    .then(getDataFromResponse)
    .catch(formatError);
};

const addDailyProduction = (data) => {
  return apiClient
    .post('/daily-production', data)
    .then(getDataFromResponse)
    .catch(formatError);
};
const addOrder = (data) => {
  return apiClient
    .post('/order', data)
    .then(getDataFromResponse)
    .catch(formatError);
};

const addReceivedStock = (data) => {
  return apiClient
    .post('/received-stock', data)
    .then(getDataFromResponse)
    .catch(formatError);
};
const createFumigation = (data) => {
  return apiClient
    .post('/fumigation', data)
    .then(getDataFromResponse)
    .catch(formatError);
};

const pickOrder = (orderId) => {
  return apiClient
    .post(`/pick-order/${orderId}`)
    .then(getDataFromResponse)
    .catch(formatError);
};

const getCurrentUser = () => {
  return apiClient
    .get('/current-user')
    .then(getDataFromResponse)
    .catch(formatError);
};
const getBranches = () => {
  return apiClient
    .get('/branches')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getSuppliers = () => {
  return apiClient
    .get('/suppliers')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getGrainTypes = () => {
  return apiClient
    .get('/grain-types')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getReceivedProduce = () => {
  return apiClient
    .get('/received-produce')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getUserAccounts = () => {
  return apiClient
    .get('/user-account')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getPendingFirstMass = () => {
  return apiClient
    .get('/pending-first-mass')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getPendingSecondMass = () => {
  return apiClient
    .get('/pending-second-mass')
    .then(getDataFromResponse)
    .catch(formatError);
};
const getPendingQA = () => {
  return apiClient
    .get('/pending-qa')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getCommodityReceipts = () => {
  return apiClient
    .get('/commodity-receipts')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getReceivedProduceTrends = (year) => {
  return apiClient
    .get('/received-produce-trends', { params: { year } })
    .then(getDataFromResponse)
    .catch(formatError);
};

const getSilos = () => {
  return apiClient.get('/silos').then(getDataFromResponse).catch(formatError);
};
const getDailyProduction = () => {
  return apiClient
    .get('/daily-production')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getReceivedVsProducedTrend = (year) => {
  return apiClient
    .get('/received-vs-produced-trend', { params: { year } })
    .then(getDataFromResponse)
    .catch(formatError);
};

const getProductionTrends = (year) => {
  return apiClient
    .get('/production-trends', { params: { year } })
    .then(getDataFromResponse)
    .catch(formatError);
};

const getStockIn = () => {
  return apiClient
    .get('/stock-in')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getStock = () => {
  return apiClient.get('/stock').then(getDataFromResponse).catch(formatError);
};

const getStockOut = () => {
  return apiClient
    .get('/stock-out')
    .then(getDataFromResponse)
    .catch(formatError);
};
const getOrders = () => {
  return apiClient.get('/order').then(getDataFromResponse).catch(formatError);
};

const getPendingOrders = () => {
  return apiClient
    .get('/pending-orders')
    .then(getDataFromResponse)
    .catch(formatError);
};

const getBatches = () => {
  return apiClient.get('/batches').then(getDataFromResponse).catch(formatError);
};

const getOrderPickingPlan = (orderId) => {
  return apiClient
    .get(`/order-picking-plan/${orderId}`)
    .then(getDataFromResponse)
    .catch(formatError);
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
