import { RouterProvider } from 'react-router-dom';
import useAuth from './auth/useAuth';
import { createRoutesForRole } from './routes';

function App() {
  const { currentUser } = useAuth();
  console.info(`✅✅${currentUser} - ${currentUser?.email || 'no one'} - ${currentUser?.roles}`)
  const routes = createRoutesForRole(currentUser?.roles[0].code);

  return <RouterProvider router={routes} />;
}

export default App;
