// material
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@material-ui/core';
import mapApi from 'api/mapApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// components
import Page from 'components/Page';
import { LayerActive } from 'constants/layer';
import { agentActions, selectAgentList } from 'features/agent/agentSlice';
import Map from 'features/map/components/Map';
// hooks
import useSettings from 'hooks/useSettings';
import 'leaflet/dist/leaflet.css';
import { GeoJSONMarker, GetStatusMap, RequestBounds, Tracking, TrackingAgent } from 'models';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// routes
import { PATH_DASHBOARD } from 'routes/paths';

import { Icon } from '@iconify/react';
import tagsFilled from '@iconify/icons-ant-design/tags-filled';
import { firebase } from 'utils/initFirebase';
import TrackingMap from '../components/TrackingMap';

// ----------------------------------------------------------------------

export default function TrackingPage() {
  const { themeStretch } = useSettings();
  const { t } = useTranslation();
  const [poisLayer, setPoisLayer] = useState<GeoJSONMarker>();
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const [storesLayer, setStoreLayer] = useState<GeoJSONMarker>();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const rs = useAppSelector(selectAgentList);
  const [listSelect, setListSelect] = useState<Number[]>([]);
  const [trackings, setTracking] = useState<TrackingAgent[]>([]);
  const { statusMapAgent } = GetStatusMap();

  const db = firebase.database();
  let list: Tracking[] = [];
  useEffect(() => {
    dispatch(agentActions.fetchAgentList({}));
  }, [dispatch]);
  useEffect(() => {
    listSelect.map((f) => {
      const agent = rs.results.find((x) => x.id === f);
      const ref = db.ref(`drivers/${f}`).limitToLast(100);

      ref.on('value', (snapshot) => {
        list.splice(0, list.length);
        snapshot.forEach((childSnapshot) => {
          //var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          list.push({
            latitude: childData.latitude,
            longitude: childData.longitude,
            time: childData.time
          });
        });
        if (agent !== undefined) {
          const newList = [...trackings];
          const index = newList.findIndex((g) => g.agent.id === agent.id);
          if (index === -1) {
            newList.push({
              agent: agent,
              locations: list
            });
          } else {
            newList.splice(index, 1);
            newList.push({
              agent: agent,
              locations: list
            });
          }
          setTracking(newList);
        }
      });

      return () => ref.off();
    });
  }, [listSelect]);
  const handleToggle = (value: number) => () => {
    const newList = [...listSelect];
    const index = newList.findIndex((x) => x === value);
    if (index !== -1) {
      newList.splice(index, 1);
      setListSelect(newList);
    } else {
      newList.push(value);
      setListSelect(newList);
    }
  };
  const handelOnChangeBounds = async (bounds: string) => {
    if (storesLayer) {
      getStoresLayer(bounds);
    }
    if (poisLayer) {
      getPoisLayer(bounds);
    }
  };
  const handelLayerActive = async (active: LayerActive, boundsBox: string) => {
    switch (active) {
      case LayerActive.Pois:
        getPoisLayer(boundsBox);
        return;
      case LayerActive.Stores: {
        getStoresLayer(boundsBox);
        return;
      }
      case LayerActive.MyStore: {
        getMyStoreLayer();
        return;
      }
    }
  };
  const handelRemoveLayer = (active: LayerActive) => {
    switch (active) {
      case LayerActive.Pois:
        setPoisLayer(undefined);
        return;
      case LayerActive.Stores: {
        setStoreLayer(undefined);
        return;
      }
      case LayerActive.MyStore: {
        setMyStoreLayer(undefined);
        return;
      }
    }
  };
  const getPoisLayer = async (boundsBox: string) => {
    try {
      const data: GeoJSONMarker = await mapApi.getPois({
        coordinateString: boundsBox
      } as RequestBounds);
      setPoisLayer(data);
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
    }
  };
  const getStoresLayer = async (boundsBox: string) => {
    try {
      const data: GeoJSONMarker = await mapApi.getStores({
        coordinateString: boundsBox
      } as RequestBounds);
      setStoreLayer(data);
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
    }
  };
  const getMyStoreLayer = async () => {
    try {
      const data: GeoJSONMarker = await mapApi.getMyStores();
      setMyStoreLayer(data);
    } catch (error) {
      enqueueSnackbar(t('common.errorText'), { variant: 'error' });
    }
  };
  return (
    <Page title={t('tracking.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('tracking.title')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('tracking.title') }
          ]}
        />
      </Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5} lg={4}>
          <Card>
            <Typography variant="h6" gutterBottom marginBottom={1} marginLeft={2} marginTop={1}>
              {t('tracking.title')}
            </Typography>
            <List dense>
              {rs.results?.map((value) => {
                const labelId = `checkbox-list-secondary-label${value.id}`;
                return (
                  <ListItem key={value.id} button>
                    <ListItemIcon>
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(value.id)}
                        checked={
                          listSelect.find((x) => x === value.id) !== undefined ? true : false
                        }
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemAvatar>
                      <Avatar alt={`Avatar n°${value.id}`} src={value.image} />
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      primary={`${value.username}(${value.licencePlate})`}
                    />
                    <ListItemSecondaryAction id={'status-' + labelId}>
                      <Box color={statusMapAgent[value.status].color}>
                        {statusMapAgent[value.status].name}
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <TrackingMap
            onChangeBounds={handelOnChangeBounds}
            stores={storesLayer || undefined}
            myStore={myStoreLayer || undefined}
            pois={poisLayer || undefined}
            onActiveLayer={handelLayerActive}
            onCloseLayer={handelRemoveLayer}
            trackings={trackings}
          />
        </Grid>
      </Grid>
    </Page>
  );
}
