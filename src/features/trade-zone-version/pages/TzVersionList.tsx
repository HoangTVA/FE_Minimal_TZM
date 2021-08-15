import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';
// material
import { Box } from '@material-ui/system';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTableNotPaging } from 'components/common/useTableNotPaging';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Label from 'components/Label';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { groupZoneActions } from 'features/group-zone/groupZoneSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { TzVersion, TzVersionRequest } from 'models';
import { GetConstantTimeFilter } from 'models/dto/timeFilter';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { convertTimeFilter, parseDateFilterDisplay } from 'utils/common';
import TzVersionFilter from '../components/TzVersionFilter';
import {
  selectFilter,
  selectLoading,
  selectTzVersionList,
  tzVersionActions
} from '../tzVersionSlice';

// ----------------------------------------------------------------------

export default function TzVersionList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectTzVersionList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [assetSelected, setAssetSelected] = useState<TzVersion>();
  const { dateFilter } = GetConstantTimeFilter();

  //effect
  useEffect(() => {
    dispatch(tzVersionActions.fetchTzVersionList({ ...filter, storeId: 0 }));
  }, [dispatch, filter]);
  useEffect(() => {
    dispatch(groupZoneActions.fetchGroupZoneList());
  }, [dispatch]);
  //functions
  const handelFilterChange = (newFilter: TzVersionRequest) => {
    dispatch(tzVersionActions.setFilterWithDebounce(newFilter));
  };
  //header
  const { t } = useTranslation();

  const headCells = [
    { id: '#', label: '#', disableSorting: true },
    { id: 'name', label: t('tz.tzVerName'), disableSorting: true },
    { id: 'date', label: t('tz.dateFilter'), disableSorting: true },
    { id: 'time', label: t('tz.timeFilter'), disableSorting: true },
    { id: 'storeName', label: t('tz.storesApply'), disableSorting: true },
    { id: 'gz', label: t('groupZone.name'), disableSorting: true },
    { id: 'status', label: t('common.status'), disableSorting: true },
    { id: 'action', label: t('common.actions'), disableSorting: true, align: 'center' }
  ];
  const { TblHead } = useTableNotPaging({
    headCells
  });
  const handelDetailsClick = (asset: TzVersion) => {
    navigate(`${PATH_DASHBOARD.asset.edit}/${asset.id}`);
  };
  const handelRemoveClick = (asset: TzVersion) => {
    setAssetSelected(asset);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    // try {
    //   await assetApi.remove(Number(assetSelected?.id) || 0);
    //   const newFilter = { ...filter };
    //   dispatch(assetActions.setFilter(newFilter));
    //   enqueueSnackbar(assetSelected?.name + ' ' + t('store.deleteSuccess'), {
    //     variant: 'success'
    //   });
    //   setAssetSelected(undefined);
    //   setConfirmDelete(false);
    // } catch (error) {
    //   enqueueSnackbar(assetSelected?.name + ' ' + t('common.errorText'), { variant: 'error' });
    // }
  };

  return (
    <Page title={t('asset.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('tz.tzVersion')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('tz.tzVersion') }
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Icon icon={plusFill} width={20} height={20} />}
              onClick={() => {}}
            >
              {t('tz.add')}
            </Button>
          }
        />

        <Card>
          <TzVersionFilter filter={filter} onChange={handelFilterChange} />

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

                  {rs.map((e, idx) => (
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
                        {/* {e.storesName.length === 0
                          ? t('store.none')
                          : e.storesName.map((f) => (
                              <Chip
                                key={f}
                                variant="outlined"
                                icon={<StorefrontIcon />}
                                label={f}
                                color="primary"
                              />
                            ))} */}
                        {e.storesName.length}
                      </TableCell>
                      <TableCell align="left">
                        {e.groupZoneName === '' ? t('store.none') : e.groupZoneName}
                      </TableCell>
                      <TableCell>
                        <Box color={e.isActive ? 'green' : 'red'} fontWeight="bold">
                          {e.isActive ? t('tz.active') : t('tz.unActive')}
                        </Box>
                      </TableCell>
                      <TableCell width={250}>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            color="info"
                            onClick={() => handelDetailsClick(e)}
                            startIcon={<Icon icon={editFill} />}
                          >
                            {t('common.editInfo')}
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handelRemoveClick(e)}
                            startIcon={<Icon icon={trash2Outline} />}
                          >
                            {t('common.remove')}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rs.length === 0 && (
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
        </Card>
      </Container>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {'Poi: ' + assetSelected?.name + ' ' + t('store.removeTitleEnd')}
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
    </Page>
  );
}
