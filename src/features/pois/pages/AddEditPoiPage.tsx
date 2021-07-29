import { Box, Card, Container, Grid, Stack } from '@material-ui/core';
import poiApi from 'api/poiApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { MapDraggable, SearchAddress } from 'components/common';
import MapWithMarker from 'components/common/MapWithMarker';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { poiActions, selectFilter } from 'features/pois/poiSlice';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Address, Poi, PoiDetails, PostPoi } from 'models';
import { useSnackbar } from 'notistack5';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser, splitWktToLatLng } from 'utils/common';
import PoiForm from '../components/PoiForm';
import './style.css';

export default function AddEditPoiPage() {
  const { poiId } = useParams();
  const isEdit = Boolean(poiId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [poi, setPoi] = useState<PoiDetails>();
  const [location, setLocation] = useState<LatLngExpression>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const [locationSelected, setLocationSelected] = useState('');
  useEffect(() => {
    if (!poiId) return;

    //IFFE
    (async () => {
      try {
        const data: PoiDetails = await poiApi.getPoiById(poiId);
        setPoi(data);

        if (data?.geom) {
          const detailsLocation: LatLngExpression = [
            data?.geom?.coordinates[0][1],
            data?.geom?.coordinates[0][0]
          ];
          setLocation(detailsLocation);
        }
      } catch (error) {}
    })();
  }, [poiId]);
  const handelStoreFormSubmit = async (formValues: PostPoi) => {
    if (!isEdit) {
      try {
        if (locationSelected === '') {
          enqueueSnackbar(t('poi.errorPoiId'), { variant: 'warning' });
          return;
        }
        formValues.geom = locationSelected;
        await poiApi.addPoi(formValues);
        enqueueSnackbar(formValues?.name + ' ' + t('poi.addSPoiSuccess'), { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(poiActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.poi.root);
      } catch (error) {
        enqueueSnackbar(
          formValues?.name + ' ' + t('common.errorText') + ' ,' + t('poi.errorBrandPoiExisted'),
          { variant: 'error' }
        );
      }
    }
  };
  const initialValues: PostPoi = {
    geom: '',
    name: '',
    poiCode: '',
    poiTypeId: 0,
    ...poi
  } as PostPoi;
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
    setLocationSelected(address?.latlng[1].toString() + ' ' + address?.latlng[0].toString());
  };
  const handelOnDragMarker = (point: LatLngExpression) => {
    setLocationSelected(point['lng'].toString() + ' ' + point['lat'].toString());
  };
  return (
    <Page title={isEdit ? t('poi.sPoiDetails') : t('poi.addSpoi')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('poi.sPoiDetails') : t('poi.addSpoi')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('poi.poi'), href: PATH_DASHBOARD.poi.root },
            { name: isEdit ? t('poi.sPoiDetails') : t('poi.addSpoi') }
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    {isEdit ? (
                      <MapWithMarker position={location} />
                    ) : (
                      <>
                        <SearchAddress onChangeAddress={handelSelectLocation} />
                        <Box mt={3}>
                          <MapDraggable location={location} onDraggable={handelOnDragMarker} />
                        </Box>
                      </>
                    )}
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              {(!isEdit || Boolean(poi)) && (
                <PoiForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
