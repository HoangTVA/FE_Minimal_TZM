import { Box, Card, Container, Grid, Stack, TextField } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { SearchAddress } from 'components/common';
import MapWithMarker from 'components/common/MapWithMarker';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Address, PostStore, Store } from 'models';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import StoreForm from '../components/StoreForm';
import { storeActions } from '../storeSlice';
import { useSnackbar } from 'notistack5';
import { selectFilter } from 'features/pois-brand/poiBrandSlice';
import './style.css';

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
  const [imgLink, setImglink] = useState<string>(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Circle-icons-image.svg/1024px-Circle-icons-image.svg.png'
  );
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
  const handelImageChange = (value: string) => {
    setImglink(value);
  };
  return (
    <Page title={isEdit ? t('store.formAdd') : t('store.detailsStore')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('store.formAdd') : t('store.detailsStore')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: t('store.title'), href: PATH_DASHBOARD.store.root },
            { name: isEdit ? t('store.btnAdd') : t('store.detailsStore') }
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <SearchAddress onChangeAddress={handelSelectLocation} />
                    <Box mt={3}>
                      <MapWithMarker position={location} />
                    </Box>
                  </Box>

                  <Box>
                    <Box
                      style={{
                        display: 'flex',
                        flexFlow: 'row nowrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px',
                        border: '2px solid gray',
                        height: '35vh',
                        width: '100%'
                      }}
                    >
                      <ThumbImgStyle
                        alt="error"
                        src={imgLink}
                        onError={() =>
                          setImglink(
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Circle-icons-image.svg/1024px-Circle-icons-image.svg.png'
                          )
                        }
                      />
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
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
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
