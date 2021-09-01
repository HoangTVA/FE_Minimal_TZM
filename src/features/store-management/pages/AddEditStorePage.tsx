import { Box, Card, Container, Grid, Stack, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { MapDraggable, SearchAddress } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import Images from 'constants/image';
import { selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Address, PostStore, Store } from 'models';
import { useSnackbar } from 'notistack5';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser, splitLongString } from 'utils/common';
import StoreForm from '../components/StoreForm';
import { storeActions } from '../storeSlice';
import './style.css';
import { IconMyStore } from 'components/map/MarkerStyles';

interface AddEditStorePageProps {}
const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 300,
  height: 300,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

export default function AddEditStorePage(props: AddEditStorePageProps) {
  const { storeId } = useParams();
  const isEdit = Boolean(storeId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [store, setStore] = useState<PostStore>();
  const [location, setLocation] = useState<LatLngExpression>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const [imgLink, setImglink] = useState<string>(Images.DEFAULT_IMG);
  const user = getCurrentUser();
  useEffect(() => {
    dispatch(storeActions.fetchStoreType());
  }, [dispatch]);
  useEffect(() => {
    if (!storeId) return;

    //IFFE
    (async () => {
      try {
        const data: Store = await storeApi.getStoreById(storeId);

        let postLocation: string = '';
        if (data?.geom?.coordinates) {
          const detailsLocation: LatLngExpression = [
            data?.geom?.coordinates[1],
            data?.geom?.coordinates[0]
          ];

          postLocation = data?.geom?.coordinates[0] + ' ' + data?.geom?.coordinates[1];
          setLocation(detailsLocation);
        }
        setImglink(data?.imageUrl || '');
        const newValue: PostStore = {
          id: data?.id,
          address: data?.address || '',
          name: data?.name || '',
          imageUrl: data?.imageUrl || '',
          coordinateString: postLocation,
          storeCode: data?.storeCode || '',
          storeTypeId: data?.storeTypeId || 0
        };
        setStore(newValue);
      } catch (error) {}
    })();
  }, [storeId]);
  const handelStoreFormSubmit = async (formValues: PostStore) => {
    if (!isEdit) {
      try {
        if (!user) return;
        await storeApi.add(formValues);
        enqueueSnackbar(formValues?.name + ' ' + t('store.addSuccess'), { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(storeActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.store.root);
      } catch (error) {
        enqueueSnackbar(
          formValues?.name + ' ' + t('common.errorText') + ' ,' + t('store.storeCodeIsExisted'),
          { variant: 'error' }
        );
      }
    } else {
      try {
        if (!user) return;
        await storeApi.update(Number(storeId), formValues);
        enqueueSnackbar(
          t('store.updateSuccessStart') + formValues.name + ' ' + t('store.updateSuccessEnd'),
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(storeActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.store.root);
      } catch (error) {
        enqueueSnackbar(
          formValues?.name + ' ' + t('common.errorText') + ' ,' + t('store.storeCodeIsExisted'),
          { variant: 'error' }
        );
      }
    }
  };
  const initialValues: PostStore = {
    name: '',
    address: '',
    coordinateString: '',
    storeCode: '',
    storeTypeId: 0,
    brandId: user?.brandId,
    imageUrl: '',
    ...store
  } as PostStore;
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
  };
  const handelOnDragMarker = (point: any) => {
    // setLocationSelected(point['lng'].toString() + ' ' + point['lat'].toString());
    const latLng: LatLngExpression = [point.lat, point.lng];
    setLocation(latLng);
  };
  const handelImageChange = (value: string) => {
    setImglink(value);
  };
  return (
    <Page title={!isEdit ? t('store.formAdd') : t('store.detailsStore')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? t('store.formAdd') : t('store.detailsStore')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: t('store.title'), href: PATH_DASHBOARD.store.root },
            {
              name: splitLongString(store?.name || ''),
              href: `${PATH_DASHBOARD.store.details}/${storeId}`
            },
            { name: !isEdit ? t('store.btnAdd') : t('store.editInfo') }
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }} style={{ marginBottom: '8px' }}>
                <Typography variant="h6" gutterBottom marginBottom={4}>
                  {t('store.imageUrl')}
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Box
                      style={{
                        display: 'flex',
                        flexFlow: 'row nowrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px',

                        height: '30vh',
                        width: '100%'
                      }}
                    >
                      <ThumbImgStyle
                        alt="error"
                        src={imgLink}
                        onError={(e) => setImglink(Images.DEFAULT_IMG)}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Card>
              {(!isEdit || Boolean(store)) && (
                <StoreForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  location={location}
                  onImageChange={handelImageChange}
                  isEdit={isEdit}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom marginBottom={3}>
                  {t('store.addressMap')}
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <SearchAddress onChangeAddress={handelSelectLocation} />
                    <Box mt={3}>
                      <MapDraggable
                        location={location}
                        onDraggable={handelOnDragMarker}
                        icon={IconMyStore}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
