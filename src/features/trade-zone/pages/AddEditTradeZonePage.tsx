import { Box, Container, Grid } from '@material-ui/core';
import assetApi from 'api/assetApi';
import mapApi from 'api/mapApi';
import tradeZoneApi from 'api/tradeZoneApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import SelectMUI from 'components/material-ui/SelectMUI';
import Page from 'components/Page';
import { LayerActive } from 'constants/layer';
import { selectTzVersionOptions } from 'features/trade-zone-version/tzVersionSlice';
import useSettings from 'hooks/useSettings';
import { TradeZone, PostTradeZone, GeoJSONMarker, RequestBounds } from 'models';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import MapEditTradeZone from '../components/MapEditTradeZone';
import TradeZoneForm from '../components/TradeZoneForm';
import { selectFilter, selectFreeZoneOptions, tradeZoneActions } from '../tradeZoneSlice';
import { Feature, GroupZoneDetails, PostGroupZone } from 'models/dto/groupZone';
import { storeActions } from 'features/store-management/storeSlice';

export default function AddEditTradeZonePage() {
  const { tradeZoneId } = useParams();
  const isEdit = Boolean(tradeZoneId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [tradeZone, setTradeZone] = useState<TradeZone>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(2);
  const [tzVersion, setTzVersion] = useState(-1);
  const tzVersionOptions = useAppSelector(selectTzVersionOptions);
  const [poisLayer, setPoisLayer] = useState<GeoJSONMarker>();
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const [storesLayer, setStoreLayer] = useState<GeoJSONMarker>();
  const [listSelected, setListSelected] = useState<number[]>([]);
  const [listPost, setListPost] = useState<number[]>([]);
  const filter = useAppSelector(selectFilter);

  useEffect(() => {
    if (!tradeZoneId) return;

    //IFFE
    (async () => {
      try {
        const data: TradeZone = await tradeZoneApi.getById(tradeZoneId);
        setTradeZone(data);
      } catch (error) {}
    })();
  }, [tradeZoneId]);
  useEffect(() => {
    dispatch(storeActions.fetchStores({}));
  }, [dispatch]);
  const handelStoreFormSubmit = async (formValues: PostTradeZone) => {
    if (!isEdit) {
      try {
        if (formValues.listZoneId.length === 0) {
          enqueueSnackbar(t('tz.errorZoneTz'), { variant: 'warning' });
          return;
        }
        if (formValues.stores.length === 0) {
          enqueueSnackbar(t('tz.errorStoreTz'), { variant: 'warning' });
          return;
        }
        formValues.tradeZoneVersionId = tzVersion;
        formValues.type = selectMode;

        await tradeZoneApi.add(formValues);
        enqueueSnackbar(formValues?.name + ' ' + t('tz.addSuccess'), { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(tradeZoneActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.tradeZone.tradeZones);
      } catch (error) {
        enqueueSnackbar(formValues?.name + ' ' + t('common.errorText'), { variant: 'error' });
      }
    } else {
      //   try {
      //     await assetApi.update(tradeZoneId, formValues);
      //     enqueueSnackbar(
      //       t('asset.updateSuccessStart') + formValues.name + ' ' + t('asset.updateSuccessEnd'),
      //       { variant: 'success' }
      //     );
      //     const newFilter = { ...filter };
      //     dispatch(assetActions.setFilter(newFilter));
      //     navigate(PATH_DASHBOARD.asset.assets);
      //   } catch (error) {
      //     enqueueSnackbar(formValues?.name + ' ' + t('common.errorText'), { variant: 'error' });
      //   }
    }
  };
  const initialValues: PostTradeZone = {
    name: '',
    groupZoneId: 0,
    tradeZoneVersionId: 0,
    ...tradeZone
  } as PostTradeZone;
  const freeWardOptions = [
    { id: 1, name: t('groupZone.ward') },
    { id: 2, name: t('groupZone.district') },
    { id: 0, name: t('common.systemZone') }
  ];
  //map
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
  const handelSelectFreeZone = (select: Feature) => {
    listSelected.push(select.properties.f3);
    setListSelected((old) => [...old]);
    const newList = [...listSelected];
    setListPost(newList);
  };
  const handelRemoveFreeZone = (select: Feature) => {
    listSelected.splice(
      listSelected.findIndex((item) => item === select.properties.f3),
      1
    );
    setListSelected((old) => [...old]);
    const newList = [...listSelected];

    setListPost(newList);
  };
  const handelTzVersionChange = (value) => {
    dispatch(
      tradeZoneActions.fetchFreeZoneList({
        type: selectMode,
        tzVersionId: value
      })
    );
    setTzVersion(value);
  };
  const handelModeChange = (value) => {
    if (tzVersion !== -1) {
      dispatch(
        tradeZoneActions.fetchFreeZoneList({
          type: value,
          tzVersionId: tzVersion
        })
      );
    }
    setSelectMode(value);
  };
  return (
    <Page title={isEdit ? t('tz.editTitleTz') : t('tz.addTitleTz')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('tz.editTitleTz') : t('tz.addTitleTz')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('tz.tzList'), href: PATH_DASHBOARD.tradeZone.tradeZones },
            {
              name: isEdit ? tradeZone?.name || '' : t('tz.addTitleTz')
            }
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {(!isEdit || Boolean(tradeZone)) && (
                <TradeZoneForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                  listPost={listPost}
                />
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                style={{
                  display: 'flex',
                  flexFlow: 'column nowrap'
                }}
              >
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <SelectMUI
                        isAll={true}
                        label={t('tz.tzVerName')}
                        labelId="filterByTz"
                        options={tzVersionOptions}
                        onChange={handelTzVersionChange}
                        selected={tzVersion === -1 ? '' : tzVersion}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <SelectMUI
                        isAll={false}
                        label={t('groupZone.mode')}
                        labelId="filterByMode"
                        options={freeWardOptions}
                        onChange={handelModeChange}
                        selected={selectMode}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box mt={2}>
                  <MapEditTradeZone
                    onChangeBounds={handelOnChangeBounds}
                    stores={storesLayer || undefined}
                    myStore={myStoreLayer || undefined}
                    pois={poisLayer || undefined}
                    onActiveLayer={handelLayerActive}
                    onCloseLayer={handelRemoveLayer}
                    listSelected={listSelected}
                    onFreeZoneClick={handelSelectFreeZone}
                    onFreeZoneRemove={handelRemoveFreeZone}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
