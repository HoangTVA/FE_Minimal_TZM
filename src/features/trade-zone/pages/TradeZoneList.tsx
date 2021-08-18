import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography
} from '@material-ui/core';
import StorefrontIcon from '@material-ui/icons/Storefront';
// material
import { Box } from '@material-ui/system';
import mapApi from 'api/mapApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Label from 'components/Label';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { LayerActive } from 'constants/layer';
import GroupZoneMap from 'features/group-zone/components/GroupZoneMap';
import { groupZoneActions } from 'features/group-zone/groupZoneSlice';
import { tzVersionActions } from 'features/trade-zone-version/tzVersionSlice';
// hooks
import useSettings from 'hooks/useSettings';
import {
  GeoJSONMarker,
  RequestBounds,
  TradeZone,
  TradeZonePagingRequest,
  TzVersionRequest
} from 'models';
import { GetConstantTimeFilter } from 'models/dto/timeFilter';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { convertTimeFilter, parseDateFilterDisplay } from 'utils/common';
import TradeZoneFilter from '../components/TradeZoneFilter';
import ViewTradeZoneMap from '../components/TradeZoneViewMap';
import {
  selectFilter,
  selectLoading,
  selectTradeZoneList,
  tradeZoneActions
} from '../tradeZoneSlice';

export default function TradeZoneList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectTradeZoneList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { dateFilter } = GetConstantTimeFilter();
  const [popupOpen, setPopupOpen] = useState(false);
  const [tradeZoneSelected, setTradeZoneSelected] = useState<TradeZone>();
  const [poisLayer, setPoisLayer] = useState<GeoJSONMarker>();
  const [myStoreLayer, setMyStoreLayer] = useState<GeoJSONMarker>();
  const [storesLayer, setStoreLayer] = useState<GeoJSONMarker>();

  //effect
  useEffect(() => {
    dispatch(
      tzVersionActions.fetchTzVersionList({
        dateFilter: '1111111',
        timeSlot: '111111111111111111111111',
        groupZoneId: 0
      } as TzVersionRequest)
    );
    dispatch(groupZoneActions.fetchGroupZoneList());
  }, [dispatch]);
  useEffect(() => {
    dispatch(tradeZoneActions.fetchTradeZoneList(filter));
  }, [dispatch, filter]);
  //functions
  const handelFilterChange = (newFilter: TradeZonePagingRequest) => {
    dispatch(tradeZoneActions.setFilterWithDebounce(newFilter));
  };
  //header
  const { t } = useTranslation();

  const headCells = [
    { id: '#', label: '#', disableSorting: true },
    { id: 'name', label: t('tz.name') },
    { id: 'date', label: t('tz.dateFilter'), disableSorting: true },
    { id: 'time', label: t('tz.timeFilter'), disableSorting: true },
    { id: 'storeName', label: t('tz.storesApply'), disableSorting: true },
    { id: 'tzVersionName', label: t('tz.tzVerName'), disableSorting: true },
    { id: 'gz', label: t('groupZone.name'), disableSorting: true },
    { id: 'action', label: t('common.actions'), disableSorting: true, align: 'center' }
  ];
  const onPageChange = (page: number) => {
    dispatch(
      tradeZoneActions.setFilter({
        ...filter,
        page: page + 1
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      tradeZoneActions.setFilter({
        ...filter,
        pageSize: perPage
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      tradeZoneActions.setFilter({
        ...filter,
        colName: colName,
        sortType: sortType
      })
    );
  };
  const handelSearchDebounce = (newFilter: TradeZonePagingRequest) => {
    dispatch(tradeZoneActions.setFilterWithDebounce(newFilter));
  };
  const { TblHead, TblPagination } = useTable({
    rs,
    headCells,
    filter,
    onPageChange,
    onRowPerPageChange,
    onSortChange
  });
  const handelDetailsClick = (tz: TradeZone) => {
    setTradeZoneSelected(tz);
    setPopupOpen(true);
  };
  const handelRemoveClick = (tz: TradeZone) => {
    setTradeZoneSelected(tz);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      //   await tzVersionApi.remove(Number(tzVersionSelected?.id) || 0);
      //   const newFilter = { ...filter };
      //   dispatch(tzVersionActions.setFilter(newFilter));
      //   enqueueSnackbar(tzVersionSelected?.name + ' ' + t('store.deleteSuccess'), {
      //     variant: 'success'
      //   });
      //   setTzVersionSelected(undefined);
      //   setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(tradeZoneSelected?.name + ' ' + t('common.errorText'), { variant: 'error' });
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
    <Page title={t('tz.tzList')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('tz.tzList')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('tz.tzList') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.tradeZone.addTz}
              startIcon={<Icon icon={plusFill} width={20} height={20} />}
            >
              {t('tz.add')}
            </Button>
          }
        />

        <Card>
          <TradeZoneFilter onChange={handelFilterChange} onSearchChange={handelSearchDebounce} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TblHead />
                <TableBody>
                  {true && (
                    <TableRow style={{ height: 1 }}>
                      <TableCell colSpan={20} style={{ paddingBottom: '0px', paddingTop: '0px' }}>
                        <Box>{loading && <LinearProgress color="primary" />}</Box>
                      </TableCell>
                    </TableRow>
                  )}

                  {rs.results.map((e, idx) => (
                    <TableRow key={e.id}>
                      <TableCell align="left">{idx + 1}</TableCell>
                      <TableCell align="left">{e.name}</TableCell>

                      <TableCell align="left" width={200}>
                        {parseDateFilterDisplay(e.dateFilter).map((f) => (
                          <Label key={f.start + ''} color="info">
                            {f.end !== -1
                              ? `${dateFilter[f.start]}->${dateFilter[f.end]}`
                              : `${dateFilter[f.start]}`}
                          </Label>
                        ))}
                      </TableCell>
                      <TableCell align="left" width={200}>
                        {convertTimeFilter(e.timeSlot).map((f) => (
                          <Label key={f.start + ''} color="warning">{`${f.start}->${f.end}`}</Label>
                        ))}
                      </TableCell>
                      <TableCell align="center">
                        {e.storesName.length === 0
                          ? t('store.none')
                          : e.storesName.map((f) => (
                              <Chip
                                key={f.id}
                                variant="outlined"
                                icon={<StorefrontIcon />}
                                label={f.name}
                                color="primary"
                              />
                            ))}
                      </TableCell>
                      <TableCell align="left">
                        {e.tradeZoneVersionName === '' ? t('store.none') : e.tradeZoneVersionName}
                      </TableCell>
                      <TableCell align="left">
                        {e.groupZoneName === '' ? t('store.none') : e.groupZoneName}
                      </TableCell>
                      <TableCell>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip key={`btnDetails-${e.id}`} title={t('common.details') || ''}>
                            <IconButton color="info" onClick={() => handelDetailsClick(e)}>
                              <Icon icon={editFill} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip key={`btnDelete-${e.id}`} title={t('common.remove') || ''}>
                            <IconButton color="error" onClick={() => handelRemoveClick(e)}>
                              <Icon icon={trash2Outline} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rs.results.length === 0 && (
                    <TableRow style={{ height: 53 * 10 }}>
                      <TableCell colSpan={20}>
                        <Typography gutterBottom align="center" variant="subtitle1">
                          {t('common.notFound')}
                        </Typography>
                        <Typography variant="body2" align="center">
                          {t('common.searchNotFound')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TblPagination />
        </Card>
      </Container>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {'Version: ' + tradeZoneSelected?.name + ' ' + t('store.removeTitleEnd')}
            <br />
            {t('common.canRevert')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setConfirmDelete(false)}>
            {t('content.btnClose')}
          </Button>
          <Button onClick={handelConfirmRemoveClick} autoFocus>
            {t('common.confirmBtn')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={popupOpen} onClose={() => setPopupOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t('common.details')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <ViewTradeZoneMap
              onChangeBounds={handelOnChangeBounds}
              stores={storesLayer || undefined}
              myStore={myStoreLayer || undefined}
              pois={poisLayer || undefined}
              onActiveLayer={handelLayerActive}
              onCloseLayer={handelRemoveLayer}
              selectedTradeZone={tradeZoneSelected}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPopupOpen(false)}>
            {t('content.btnClose')}
          </Button>
          <Button
            onClick={() => {
              navigate(`${PATH_DASHBOARD.tradeZone.editTz}/${tradeZoneSelected?.id}`);
            }}
            autoFocus
          >
            {t('common.editInfo')}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
