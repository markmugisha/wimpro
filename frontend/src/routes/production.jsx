import Production from '../pages/production/Production';
import Dashboard from '../pages/quality_assurance/Dashboard';
import { FaDashcube, FaBusinessTime, FaStore } from 'react-icons/fa';
import { Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import NotFound from '../pages/LoggedInNotFound';
import Silo from '../pages/production/Silo';

const navigation = [
  { text: 'Dashboard', path: '', icon: <FaDashcube color="#fb8e19" /> },
  {
    text: 'Silo',
    path: 'silo',
    icon: <FaStore color="#fb8e19" />,
  },
  {
    text: 'Production by date',
    path: 'production',
    icon: <FaBusinessTime color="#fb8e19" />,
  },
];

const production = (
  <Route path="dashboard" element={<AppLayout navigation={navigation} />}>
    <Route index element={<Dashboard />} />
    <Route path="silo" element={<Silo />} />
    <Route path="production" element={<Production />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
export default production;
