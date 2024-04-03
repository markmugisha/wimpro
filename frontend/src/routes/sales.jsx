import { Route } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/sales/Dashboard.jsx';
import Sales from '../pages/sales/Sales.jsx';
import QualityInspection from '../pages/sales/QualityInspection';
import Disposal from '../pages/sales/Disposal';
import NotFound from '../pages/LoggedInNotFound';
import { FaDashcube, FaSellcast } from 'react-icons/fa';

const navigation = [
  { text: 'Dashboard', path: '', icon: <FaDashcube color="#fb8e19" /> },
  {
    text: 'Orders',
    path: 'sales',
    icon: <FaSellcast color="#fb8e19" />,
  },
  // {
  //   text: 'Quality Inspection',
  //   path: 'quality-inspection',
  //   icon: <FaDashcube color="#fb8e19" />,
  // },
  // {
  //   text: 'Disposal',
  //   path: 'disposal',
  //   icon: <FaDashcube color="#fb8e19" />,
  // },
];

const storeInventory = (
  <Route path="dashboard" element={<AppLayout navigation={navigation} />}>
    <Route index element={<Dashboard />} />
    <Route path="sales" element={<Sales />} />
    <Route path="quality-inspection" element={<QualityInspection />} />
    <Route path="disposal" element={<Disposal />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
export default storeInventory;
