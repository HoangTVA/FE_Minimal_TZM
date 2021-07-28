import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import Login from 'features/auth/Login';
import StoreList from 'features/store-management/pages/StoreList';
import BrandMap from 'features/map/pages/BrandMap';
import PoiList from 'features/pois/pages/PoiList';
import PoiBrandList from 'features/pois-brand/pages/PoiBrandList';
import AddEditStorePage from 'features/store-management/pages/AddEditStorePage';
import AddEditPoiBrandPage from 'features/pois-brand/pages/AddEditPoiBrandPage';
// ----------------------------------------------------------------------

const Loadable = (Component: any) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const isLogIn = Boolean(localStorage.getItem('access_token'));
  return useRoutes([
    // Dashboard Routes
    {
      path: 'dashboard',
      element: isLogIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/one" replace /> },
        {
          path: 'manage-store',
          children: [
            { path: '/', element: <StoreList /> },
            { path: 'add', element: <AddEditStorePage /> },
            { path: 'details/:storeId', element: <AddEditStorePage /> }
          ]
        },
        { path: 'brand-map', element: <BrandMap /> },
        {
          path: 'pois',
          children: [
            { path: '/', element: <PoiList /> },
            { path: 'add', element: <AddEditStorePage /> },
            { path: 'details/:storeId', element: <AddEditStorePage /> }
          ]
        },
        {
          path: 'brand-pois',
          children: [
            { path: '/', element: <PoiBrandList /> },
            { path: 'add', element: <AddEditPoiBrandPage /> },
            { path: 'details/:poiId', element: <AddEditPoiBrandPage /> }
          ]
        },
        { path: 'one', element: <PageTwo /> },
        { path: 'three', element: <PageThree /> },
        {
          path: 'app',
          children: [
            {
              path: '/',
              element: <Navigate to="/dashboard/app/four" replace />
            },
            { path: 'four', element: <PageFour /> },
            { path: 'five', element: <PageFive /> },
            { path: 'six', element: <PageSix /> }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [{ path: '/', element: <LandingPage /> }]
    },
    { path: '/login', element: <Login /> },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));
const PageThree = Loadable(lazy(() => import('../pages/PageThree')));
const PageFour = Loadable(lazy(() => import('../pages/PageFour')));
const PageFive = Loadable(lazy(() => import('../pages/PageFive')));
const PageSix = Loadable(lazy(() => import('../pages/PageSix')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
