import { Route } from 'react-router-dom';
import { FaDashcube, FaTruck } from 'react-icons/fa';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/receiving/Dashboard';
import NotFound from '../pages/LoggedInNotFound';
import ReceivedProduce from '../pages/receiving/ReceivedProduce';
import Suppliers from '../pages/receiving/Suppliers';
import { AiFillReconciliation } from 'react-icons/ai';

const navigation = [
  { text: 'Dashboard', path: '', icon: <FaDashcube color="#fb8e19" /> },
  {
    text: 'Received Produce',
    path: 'received-produce',
    icon: <AiFillReconciliation color="#fb8e19" />,
  },
  {
    text: 'Suppliers',
    path: 'suppliers',
    icon: <FaTruck color="#fb8e19" />,
  },
];

const receiving = (
  <Route path="dashboard" element={<AppLayout navigation={navigation} />}>
    <Route index element={<Dashboard />} />
    <Route path="received-produce" element={<ReceivedProduce />} />
    <Route path="suppliers" element={<Suppliers />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
export default receiving;
