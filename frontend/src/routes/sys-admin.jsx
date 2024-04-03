import { Route } from 'react-router-dom';
import {
  FaCodeBranch,
  FaDashcube,
  // FaSearchLocation,
  FaUserShield,
  // FaWarehouse,
} from 'react-icons/fa';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/sys_admin/Dashboard';
import Users from '../pages/sys_admin/Users';
import Branches from '../pages/sys_admin/Branches';
import Location from '../pages/sys_admin/Location';
import Storage from '../pages/sys_admin/Storage';
import NotFound from '../pages/LoggedInNotFound';

const navigation = [
  {
    text: 'Dashboard',
    path: '',
    icon: <FaDashcube color="#fb8e19" />
  },
  {
    text: 'Branches',
    path: 'branches',
    icon: <FaCodeBranch color="#fb8e19" />,
  },
  {
    text: 'Users',
    path: 'users',
    icon: <FaUserShield color="#fb8e19" />
  },
  // {
  //   text: 'Location',
  //   path: 'location',
  //   icon: <FaSearchLocation color="#fb8e19" />,
  // },
  // {
  //   text: 'Storage System',
  //   path: 'storage',
  //   icon: <FaWarehouse color="#fb8e19" />,
  // },
];

const sysAdmin = (
  <Route path="dashboard" element={<AppLayout navigation={navigation} />}>
    <Route index element={<Dashboard />} />
    <Route path="users" element={<Users />} />,
    <Route path="branches" element={<Branches />} />,
    <Route path="location" element={<Location />} />,
    <Route path="storage" element={<Storage />} />,
    <Route path="*" element={<NotFound />} />
  </Route>
);
export default sysAdmin;
