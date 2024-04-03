import Dashboard from '../pages/quality_assurance/Dashboard';
import QaPending from '../pages/quality_assurance/QaPending';
// import QaAssessed from '../pages/quality_assurance/QaAssessed';
import { FaCloudscale, FaDashcube } from 'react-icons/fa';
import { Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import NotFound from '../pages/LoggedInNotFound';

const navigation = [
  { text: 'Dashboard', path: '', icon: <FaDashcube color="#fb8e19" /> },
  {
    text: 'Assess',
    path: 'qa-pending',
    icon: <FaCloudscale color="#fb8e19" />,
  },
];

const qualityAssessment = (
  <Route path="dashboard" element={<AppLayout navigation={navigation} />}>
    <Route index element={<Dashboard />} />
    <Route path="qa-pending" element={<QaPending />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
export default qualityAssessment;
