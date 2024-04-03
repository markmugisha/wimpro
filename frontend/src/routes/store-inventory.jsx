import { Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/store_inventory/Dashboard';
import Manage_stock from '../pages/store_inventory/Manage_stock';
import NotFound from '../pages/LoggedInNotFound';
import { FaDashcube } from 'react-icons/fa';

const navigation = [
  { text: 'Dashboard', path: '', icon: <FaDashcube color="#fb8e19" /> },
  {
    text: 'Manage Stock',
    path: 'manage-stock',
    icon: <FaDashcube color="#fb8e19" />,
  },
];

const storeInventory = (
  <Route path="dashboard" element={<AppLayout navigation={navigation} />}>
    <Route index element={<Dashboard />} />
    <Route path="manage-stock" element={<Manage_stock />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
export default storeInventory;
