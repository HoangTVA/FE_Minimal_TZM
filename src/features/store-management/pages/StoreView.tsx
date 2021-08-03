import { Box, Card, CardHeader, Container, Grid, Stack, Tab, TextField } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import MapWithMarker from 'components/common/MapWithMarker';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import Images from 'constants/image';
import { selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Address, PostStore, Store } from 'models';
import { AttrResponse } from 'models/dto/attrResponse';
import { useSnackbar } from 'notistack5';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import AttrForm from '../components/AttrForm';
import { Block } from '../components/Block';
import StoreForm from '../components/StoreForm';
import { storeActions } from '../storeSlice';
import './style.css';

interface StoreViewPageProps {}
const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 300,
  height: 300,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));
const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '8px !important' }
} as const;
export default function StoreViewPage(props: StoreViewPageProps) {
  const { storeId } = useParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [store, setStore] = useState<Store>();
  const [storeForm, setStoreForm] = useState<PostStore>();
  const [location, setLocation] = useState<LatLngExpression>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const [attrs, setAttrs] = useState<AttrResponse[]>();
  const user = getCurrentUser();
  const [value, setValue] = useState('1');
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
        const newValue: PostStore = {
          id: data?.id,
          address: data?.address || '',
          name: data?.name || '',
          imageUrl: data?.imageUrl || '',
          coordinateString: postLocation,
          storeCode: data?.storeCode || '',
          storeTypeId: data?.storeTypeId || 0
        };
        setStore(data);
        setStoreForm(newValue);
        if (data.storeTypeId) {
          const attrData: AttrResponse[] = await storeApi.getAttrField(
            storeId,
            data.storeTypeId.toString()
          );
          setAttrs(attrData);
        }
      } catch (error) {}
    })();
  }, [storeId]);

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
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Page title={t('store.detailsStore')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('store.detailsStore')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: t('store.title'), href: PATH_DASHBOARD.store.root },
            { name: t('store.detailsStore') }
          ]}
        />
        <Box>
          <Card sx={{ p: 3 }} style={{ paddingTop: '0px' }}>
            <CardHeader title={t('store.info')} />
            <Grid container>
              <Grid item xs={12} md={4} lg={5}>
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
                    src={store?.imageUrl}
                    onError={(e: any) => {
                      e.target.src = Images.DEFAULT_IMG;
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8} lg={7}>
                {Boolean(store) && (
                  <StoreForm
                    initialValue={initialValues}
                    onSubmit={() => {}}
                    location={location}
                    onImageChange={() => {}}
                    isEdit={false}
                    isView={true}
                  />
                )}
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3 }} style={{ paddingTop: '0px', marginTop: '20px' }}>
            <CardHeader title={t('store.addressMap')} />
            <Stack spacing={3}>
              <Box>
                <Box mt={3}>
                  <MapWithMarker position={location} />
                </Box>
              </Box>
            </Stack>
          </Card>
          <Card sx={{ p: 3 }} style={{ paddingTop: '0px', marginTop: '20px' }}>
            <CardHeader title={t('store.attrs')} />
            <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
              <Block sx={style}>
                <TabContext value={value}>
                  <TabList onChange={handleChange}>
                    {attrs?.map((tab, index) => (
                      <Tab key={tab.id} label={tab.name} value={String(index + 1)} />
                    ))}
                  </TabList>
                  <Box
                    sx={{
                      p: 2,
                      mt: 2,

                      width: '100%',
                      borderRadius: 1,
                      bgcolor: 'grey.50012'
                    }}
                  >
                    {attrs?.map((panel, index) => (
                      <TabPanel key={panel.id} value={String(index + 1)}>
                        <AttrForm initialValue={panel.attrs} isView={true} />
                      </TabPanel>
                    ))}
                  </Box>
                </TabContext>
              </Block>
            </Stack>
          </Card>
          {store?.template && (
            <Card sx={{ p: 3 }} style={{ paddingTop: '0px', marginTop: '20px' }}>
              <CardHeader title={t('content.templates')} />
              <Grid container>
                <Grid item xs={12} md={4} lg={5}>
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
                      src={store?.template.imageUrl}
                      onError={(e: any) => {
                        e.target.src = Images.DEFAULT_IMG;
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8} lg={7}>
                  <Stack spacing={3}>
                    <Card sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        <TextField
                          label={t('store.templateId')}
                          variant="outlined"
                          defaultValue={store?.template.id}
                          disabled
                        />
                        <TextField
                          label={t('store.templateName')}
                          variant="outlined"
                          defaultValue={store?.template.name}
                          disabled
                        />
                        <TextField
                          label={t('store.url')}
                          variant="outlined"
                          defaultValue={store?.url}
                          disabled
                        />
                      </Stack>
                    </Card>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          )}
        </Box>
      </Container>
    </Page>
  );
}
