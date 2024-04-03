import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import sysAdminRoutes from './sys-admin';
import Home from '../pages/Home';
import LogIn from '../pages/LogIn';
import VerifyAccount from '../pages/VerifyAccount';
import CreateOrganization from '../pages/CreateOrganization';
import NotFound from '../pages/NotFound';
import receivingRoutes from './receiving';
import qualityAssessmentRoutes from './quality-assessment';
import weighbridgeRoutes from './weighbridge';
import productionRoutes from './production';
import storeManagementRoutes from './store-inventory';
import salesRoutes from './sales';

const createRoutesForRole = (role) => {
  return createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="create-organization" element={<CreateOrganization />} />
        <Route path="login" element={<LogIn />} />
        <Route path="verify/:token" element={<VerifyAccount />} />

        {getRoutesForRole(role)}

        <Route path="*" element={<NotFound />} />
      </>
    )
  );
};

const getRoutesForRole = (role) => {
  switch (role) {
    case 'sys_admin':
      return sysAdminRoutes;
    case 'receiving':
      return receivingRoutes;
    case 'quality_assessment':
      return qualityAssessmentRoutes;
    case 'weigh_bridge':
      return weighbridgeRoutes;
    case 'production':
      return productionRoutes;
    case 'store_management':
      return storeManagementRoutes;
    case 'sales':
      return salesRoutes;
    default:
      return null;
  }
};

export { createRoutesForRole };
