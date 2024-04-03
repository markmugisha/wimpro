import { Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { FaDashcube } from 'react-icons/fa';
import NotFound from '../pages/LoggedInNotFound';
import Dashboard from '../pages/weigh_bridge/Dashboard';
import CommodityReceipt from '../pages/weigh_bridge/CommodityReceipt';

const navigation = [
  { text: 'Dashboard', path: '', icon: <FaDashcube color="#fb8e19" /> },
  {
    text: 'Commodity Receipts',
    path: 'commodity-receipt',
    icon: <FaDashcube color="#fb8e19" />,
  },
];

const commodityReceipt = (
  <Route path="dashboard" element={<AppLayout navigation={navigation} />}>
    <Route index element={<Dashboard />} />
    <Route path="commodity-receipt" element={<CommodityReceipt />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
export default commodityReceipt;
