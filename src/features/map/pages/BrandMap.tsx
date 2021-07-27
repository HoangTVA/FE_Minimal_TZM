import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';

// routes
import { PATH_DASHBOARD } from 'routes/paths';
// hooks
import useSettings from 'hooks/useSettings';
// components
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { useTranslation } from 'react-i18next';
import Map from '../components/Map';
import 'leaflet/dist/leaflet.css';
// ----------------------------------------------------------------------

export default function BrandMap() {
  const { themeStretch } = useSettings();
  const { t } = useTranslation();
  return (
    <Page title={t('map.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Create a new user'}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('content.map') }
          ]}
        />
      </Container>
      <Map />
    </Page>
  );
}
