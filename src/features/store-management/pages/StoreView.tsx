import editFill from '@iconify/icons-eva/edit-fill';
import cloudDownloadFill from '@iconify/icons-eva/cloud-download-fill';
import { Icon } from '@iconify/react';
import QRCode from 'qrcode.react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Grid,
  Stack,
  Tab,
  TextField,
  Typography
} from '@material-ui/core';
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
import { PostStore, Store } from 'models';
import { AttrResponse } from 'models/dto/attrResponse';
import { useSnackbar } from 'notistack5';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
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
  const downloadQR = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'test.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else return;
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
            <CardHeader
              title={t('store.info')}
              action={
                <Button
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.store.editInfo}/${store?.id}`}
                  startIcon={<Icon icon={editFill} />}
                >
                  {t('common.editInfo')}
                </Button>
              }
            ></CardHeader>
            <Grid container marginTop={2}>
              <Grid item xs={12} md={4} lg={5}>
                <Card sx={{ p: 3 }} style={{ height: '641px', width: '95%' }}>
                  <Typography variant="h6" gutterBottom marginBottom={4}>
                    {t('store.imageUrl')}
                  </Typography>
                  <Box
                    style={{ width: '100%' }}
                    sx={{ position: 'relative', pt: 'calc(100% / 16 * 9)' }}
                  >
                    <Box
                      component="img"
                      alt="error"
                      src={store?.imageUrl}
                      sx={{
                        top: 0,
                        width: 1,
                        height: 1,
                        borderRadius: 1,
                        objectFit: 'cover',
                        position: 'absolute'
                      }}
                    />
                  </Box>
                </Card>
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
            <CardHeader
              title={t('store.attrs')}
              action={
                <Button
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.store.editAttrs}/${store?.id}/${store?.storeTypeId}`}
                  startIcon={<Icon icon={editFill} />}
                >
                  {t('common.editInfo')}
                </Button>
              }
            />

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
                  <TabPanel key={panel.id} value={String(index + 1)} style={{ padding: '0px' }}>
                    <AttrForm initialValue={panel.attrs} isView={true} />
                  </TabPanel>
                ))}
              </Box>
            </TabContext>
          </Card>
          {store?.template && (
            <Card sx={{ p: 3 }} style={{ paddingTop: '0px', marginTop: '20px' }}>
              <CardHeader
                title={t('content.templates')}
                action={
                  <>
                    <Button
                      onClick={downloadQR}
                      color="info"
                      startIcon={<Icon icon={cloudDownloadFill} color="#1890FF" />}
                    >
                      {t('content.btnDownloadQR')}
                    </Button>
                    <Button
                      component={RouterLink}
                      to={`${PATH_DASHBOARD.store.editTemplates}/${store?.id}`}
                      startIcon={<Icon icon={editFill} />}
                    >
                      {t('common.editInfo')}
                    </Button>
                  </>
                }
              />
              <Grid container marginTop={2} spacing={2}>
                <Grid item xs={6} md={3} lg={3}>
                  <Card sx={{ p: 3 }} style={{ height: '300px' }}>
                    <Typography variant="h6" gutterBottom>
                      QR Code
                    </Typography>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexFlow: 'row nowrap'
                      }}
                    >
                      <QRCode
                        id="qrcode"
                        value={store.url}
                        size={190}
                        level={'H'}
                        includeMargin={true}
                      />
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                  <Card sx={{ p: 3 }} style={{ height: '300px' }}>
                    <Typography variant="h6" gutterBottom>
                      {t('store.imageUrl')}
                    </Typography>
                    <Box
                      style={{ width: '100%' }}
                      sx={{ position: 'relative', pt: 'calc(100% / 16 * 9)' }}
                    >
                      <Box
                        component="img"
                        alt="error"
                        src={store?.template.imageUrl}
                        sx={{
                          top: 0,
                          width: 1,
                          height: 1,
                          borderRadius: 1,
                          objectFit: 'cover',
                          position: 'absolute'
                        }}
                      />
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <Stack spacing={3}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {t('store.infoTemplate')}
                      </Typography>
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
