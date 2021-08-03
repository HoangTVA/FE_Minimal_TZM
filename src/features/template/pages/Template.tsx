import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useDebouncedCallback } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import SelectMUI from 'components/material-ui/SelectMUI';
// components
import Page from 'components/Page';
// hooks
import useSettings from 'hooks/useSettings';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import CarouselBasic3 from '../components/CarouselBasic3';
import { FetchAttrs, selectStoreOptions, templateActions } from '../templateSlice';
import './style.css';

interface TemplateProps {}

export default function Template(props: TemplateProps) {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const storeOptions = useAppSelector(selectStoreOptions);
  const [current, setCurrent] = useState(1);
  const [valueQrCode, setValueQrCode] = useState('');
  const [storeSelected, setStoreSelected] = useState(-1);
  const [text, setText] = useState('');
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(templateActions.fetchStores());
  }, [dispatch]);
  useEffect(() => {
    if (storeSelected === -1 || text === '') return;
    const valueQrCode = `https://${window.location.host}/${text}/${storeSelected}/${current}`;
    setValueQrCode(valueQrCode);
  }, [current, storeSelected, text]);
  const handelTextChange = useDebouncedCallback((e) => {
    setText(e.target.value);
  }, 500);
  const handelOnChange = (index: number) => {
    setCurrent(index);
  };
  const handelSelectStore = (selectedId: number) => {
    setStoreSelected(selectedId);
    const params: FetchAttrs = {
      storeId: selectedId,
      typeId: 4
    };

    dispatch(templateActions.fetchAttrs(params));
  };
  const downloadQR = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      console.log('pngUrl', pngUrl);
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'test.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else return;
  };

  return (
    <Page title={t('content.listTemplate')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('content.listTemplate')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: t('content.listTemplate') }
          ]}
        />

        <Card>
          <Grid container>
            <Grid item xs={12} md={7} lg={9}>
              <Card>
                <CardHeader title={t('content.listTemplate')} />
                <CardContent>
                  <CarouselBasic3 onChange={handelOnChange} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5} lg={3}>
              <Card>
                <CardHeader title={t('content.stores')} />
                <CardContent>
                  <Box
                    style={{
                      width: '100%',
                      height: '400px',
                      display: 'flex',
                      flexFlow: 'row nowrap',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {valueQrCode !== '' ? (
                      <QRCode
                        id="qrcode"
                        value={valueQrCode}
                        size={290}
                        level={'H'}
                        includeMargin={true}
                      />
                    ) : (
                      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                        {t('content.noticeTemplate')}
                      </Typography>
                    )}
                  </Box>
                  <Box mt={1}>
                    <SelectMUI
                      label={t('content.selectStore')}
                      isAll={false}
                      labelId="selectStore"
                      options={storeOptions}
                      onChange={handelSelectStore}
                      selected={storeSelected === -1 ? '' : storeSelected}
                    />
                  </Box>
                  <Box mt={1}>
                    <TextField
                      fullWidth
                      label={t('content.nameCustom')}
                      variant="outlined"
                      onChange={handelTextChange}
                    />
                  </Box>
                  <Box mt={1}>
                    {valueQrCode !== '' && (
                      <Button fullWidth onClick={downloadQR} color="primary">
                        {t('content.btnDownloadQR')}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
