import { lazy, Suspense } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// components
import LoadingScreen from '../components/LoadingScreen';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// layouts
import MainLayout from '../layouts/main';
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
        { path: '/', element: <Navigate to="/dashboard/coming-soon" replace /> },
        {
          path: 'manage-store',
          children: [
            { path: '/', element: <StoreList /> },
            { path: 'add', element: <AddEditStorePage /> },
            { path: 'details/:storeId', element: <StoreViewPage /> },
            { path: 'details/edit-info/:storeId', element: <AddEditStorePage /> },
            { path: 'details/edit-attrs/:storeId/:storeTypeId', element: <EditAttrsPage /> },
            { path: 'details/edit-templates/:storeId/:isStoreView', element: <StoreTemplatePage /> }
          ]
        },
        { path: 'brand-map', element: <BrandMap /> },
        {
          path: 'templates',
          children: [
            { path: '/', element: <Template /> },
            { path: 'edit-templates/:storeId/:isStoreView', element: <StoreTemplatePage /> }
          ]
        },
        {
          path: 'pois',
          children: [
            { path: '/', element: <PoiList /> },
            { path: 'add', element: <AddEditPoiPage /> },
            { path: 'edit/:poiId', element: <AddEditPoiPage /> }
          ]
        },
        {
          path: 'brand-pois',
          children: [
            { path: '/', element: <PoiBrandList /> },
            { path: 'add', element: <AddEditPoiBrandPage /> },
            { path: 'edit/:poiId', element: <AddEditPoiBrandPage /> }
          ]
        },
        { path: 'coming-soon', element: <ComingSoon /> },
        {
          path: 'manage-assets',
          children: [
            { path: 'list', element: <AssetList /> },
            { path: 'violation/list', element: <ComingSoon /> },
            { path: 'add', element: <AddEditAssetPage /> },
            { path: 'edit/:assetId', element: <AddEditAssetPage /> }
          ]
        },
        {
          path: 'group-zones',
          children: [
            { path: '/', element: <GroupZoneListPage /> },
            { path: 'add', element: <AddEditGroupZonePage /> },
            { path: 'edit/:groupZoneId', element: <AddEditGroupZonePage /> }
          ]
        },
        {
          path: 'trade-zones',
          children: [{ path: '/', element: <ComingSoon /> }]
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

const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
const GroupZoneListPage = Loadable(lazy(() => import('features/group-zone/pages/GroupZoneList')));
const AddEditAssetPage = Loadable(
  lazy(() => import('features/manage-assets/pages/AddEditAssetPage'))
);
const AddEditGroupZonePage = Loadable(
  lazy(() => import('features/group-zone/pages/AddEditGroupZonePage'))
);
const AddEditPoiBrandPage = Loadable(
  lazy(() => import('features/pois-brand/pages/AddEditPoiBrandPage'))
);
const BrandMap = Loadable(lazy(() => import('features/map/pages/BrandMap')));
const AssetList = Loadable(lazy(() => import('features/manage-assets/pages/AssetList')));
const Login = Loadable(lazy(() => import('features/auth/Login')));
const PoiBrandList = Loadable(lazy(() => import('features/pois-brand/pages/PoiBrandList')));
const AddEditPoiPage = Loadable(lazy(() => import('features/pois/pages/AddEditPoiPage')));
const PoiList = Loadable(lazy(() => import('features/pois/pages/PoiList')));
const AddEditStorePage = Loadable(
  lazy(() => import('features/store-management/pages/AddEditStorePage'))
);
const EditAttrsPage = Loadable(lazy(() => import('features/store-management/pages/EditAttrsPage')));
const StoreList = Loadable(lazy(() => import('features/store-management/pages/StoreList')));
const StoreTemplatePage = Loadable(
  lazy(() => import('features/store-management/pages/StoreTemplatePage'))
);
const StoreViewPage = Loadable(lazy(() => import('features/store-management/pages/StoreView')));
const Template = Loadable(lazy(() => import('features/template/pages/Template')));
const ComingSoon = Loadable(lazy(() => import('pages/ComingSoon')));
