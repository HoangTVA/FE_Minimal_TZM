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
// material
import { Box } from '@material-ui/system';
import teamApi from 'api/teamApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import { storeActions } from 'features/store-management/storeSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { PaginationRequest, Order } from 'models';
import { GetStatusOrderMap } from 'models/dto/orderStatus';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { orderActions, selectFilter, selectLoading, selectTeamList } from '../orderSlice';
// ----------------------------------------------------------------------

export default function OrderList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectTeamList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [orderSelected, setOrderSelected] = useState<Order>();
  const { statusOrderMap } = GetStatusOrderMap();

  //effect
  useEffect(() => {
    dispatch(orderActions.fetchOrderList(filter));
  }, [dispatch, filter]);
  //functions
  const onPageChange = (page: number) => {
    dispatch(
      orderActions.setFilter({
        ...filter,
        page: page + 1
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      orderActions.setFilter({
        ...filter,
        pageSize: perPage
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      orderActions.setFilter({
        ...filter,
        colName: colName,
        sortType: sortType
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(orderActions.setFilterWithDebounce(newFilter));
  };
  //header
  const { t } = useTranslation();

  const headCells = [
    { id: 'orderCode', label: t('order.code') },
    { id: 'startPoint', label: t('order.start') },
    { id: 'endPoint', label: t('order.end') },
    { id: 'items', label: t('order.items'), disableSorting: true },
    { id: 'status', label: t('common.status') },
    { id: 'action', label: t('common.actions'), disableSorting: true, align: 'center' }
  ];
  const { TblHead, TblPagination } = useTable({
    rs,
    headCells,
    filter,
    onPageChange,
    onRowPerPageChange,
    onSortChange
  });
  const handelDetailsClick = (team: Order) => {
    navigate(`${PATH_DASHBOARD.team.edit}/${team.id}`);
  };
  const handelRemoveClick = (team: Order) => {
    setOrderSelected(team);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await teamApi.remove(Number(orderSelected?.id) || 0);
      const newFilter = { ...filter };
      dispatch(orderActions.setFilter(newFilter));
      enqueueSnackbar(orderSelected?.orderCode + ' ' + t('store.deleteSuccess'), {
        variant: 'success'
      });

      setOrderSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(orderSelected?.orderCode + ' ' + t('common.errorText'), { variant: 'error' });
    }
  };

  return (
    <Page title={t('order.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('order.list')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('order.list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.order.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('order.titleAdd')}
            </Button>
          }
        />

        <Card>
          {/* <TeamFilter filter={filter} onSearchChange={handelSearchDebounce} /> */}

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
                      <TableCell align="left">{e.orderCode}</TableCell>
                      <TableCell align="left">{e.fromStation.address}</TableCell>
                      <TableCell align="left">{e.toStation.address}</TableCell>
                      <TableCell align="left">{e.packageItems.length}</TableCell>
                      <TableCell>
                        <Box color={statusOrderMap[e.status].color} fontWeight="bold">
                          {statusOrderMap[e.status].name}
                        </Box>
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
            {t('team.name') + ': ' + orderSelected?.orderCode + ' ' + t('store.removeTitleEnd')}
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
