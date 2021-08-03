import { Box, Container, Stack, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import storeApi from 'api/storeApi';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import 'leaflet/dist/leaflet.css';
import { AttrResponse } from 'models/dto/attrResponse';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import AttrForm from '../components/AttrForm';
import { Block } from '../components/Block';
import './style.css';

interface EditAttrsPageProps {}
const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': { mx: '8px !important' }
} as const;
export default function EditAttrsPage(props: EditAttrsPageProps) {
  const { storeId, storeTypeId } = useParams();
  const [attrs, setAttrs] = useState<AttrResponse[]>();
  const { themeStretch } = useSettings();
  const { t } = useTranslation();
  const [value, setValue] = useState('1');

  useEffect(() => {
    if (!storeId) return;

    //IFFE
    (async () => {
      try {
        const data: AttrResponse[] = await storeApi.getAttrField(storeId, storeTypeId);
        setAttrs(data);
        console.log(data);
      } catch (error) {}
    })();
  }, [storeId, storeTypeId]);
  const SIMPLE_TAB = [
    { value: '1', label: 'Item One', disabled: false },
    { value: '2', label: 'Item Two', disabled: false },
    { value: '3', label: 'Item Three', disabled: true }
  ];
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Page title={t('store.detailsAttrsPage')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('store.attrList')}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: t('store.title'), href: PATH_DASHBOARD.store.root },
            { name: t('store.attrs') }
          ]}
        />
        <Box>
          <Stack spacing={3}>
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
                      height: 80,
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
          </Stack>
        </Box>
      </Container>
    </Page>
  );
}
