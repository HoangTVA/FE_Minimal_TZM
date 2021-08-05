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
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
// hooks
import useSettings from 'hooks/useSettings';
import { GetStatusMap, PaginationRequest, Store } from 'models';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import StoreFilter from '../components/StoreFilter';
import { selectFilter, selectLoading, selectStoresResponse, storeActions } from '../storeSlice';

// ----------------------------------------------------------------------

export default function StoreList() {
  const { themeStretch } = useSettings();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [storeSelected, setStoreSelected] = useState<Store>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const rs = useAppSelector(selectStoresResponse);
  const loading = useAppSelector(selectLoading);
  const { statusMap } = GetStatusMap();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  //effect
  useEffect(() => {
    dispatch(storeActions.fetchStores(filter));
  }, [dispatch, filter]);

  const onPageChange = (page: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        page: page + 1
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        pageSize: perPage
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        colName: colName,
        sortType: sortType
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(storeActions.setFilterWithDebounce(newFilter));
  };

  const handelRemoveClick = (store: Store) => {
    setStoreSelected(store);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await storeApi.remove(storeSelected?.id || 0);
      const newFilter = { ...filter };
      dispatch(storeActions.setFilter(newFilter));
      enqueueSnackbar(storeSelected?.name + ' ' + t('store.deleteSuccess'), { variant: 'success' });

      setStoreSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(storeSelected?.name + ' ' + t('common.errorText'), { variant: 'error' });
    }
  };

  //header
  const { t } = useTranslation();
  const headCells = [
    { id: 'no', label: '#' },
    { id: 'name', label: t('store.storeName') },
    { id: 'address', label: t('store.address') },
    { id: 'storeTypeName', label: t('store.storeTypeName') },
    { id: 'status', label: t('common.status') },
    { id: 'actions', label: t('common.actions'), disableSorting: true, align: 'center' }
  ];

  const { TblHead, TblPagination } = useTable({
    rs,
    headCells,
    filter,
    onPageChange,
    onRowPerPageChange,
    onSortChange
  });
  const handelDetailsClick = (store: Store) => {
    navigate(`${PATH_DASHBOARD.store.details}/${store.id}`);
  };
  return (
    <Page title={t('store.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('store.listStore')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('store.listStore') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.store.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('store.btnAdd')}
            </Button>
          }
        />

        <Card>
          <StoreFilter filter={filter} onSearchChange={handelSearchDebounce} />

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
                      <TableCell width={80} component="th" scope="row" padding="none">
                        {idx + 1}
                      </TableCell>
                      <TableCell align="left">{e.name}</TableCell>
                      <TableCell align="left">{e.address}</TableCell>
                      <TableCell align="left">
                        {e.storeTypeName === '' ? t('store.none') : e.storeTypeName}
                      </TableCell>
                      <TableCell>
                        <Box color={statusMap[e.status].color} fontWeight="bold">
                          {statusMap[e.status].name}
                        </Box>
                      </TableCell>
                      <TableCell width={250}>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            color="info"
                            onClick={() => handelDetailsClick(e)}
                            startIcon={<Icon icon={editFill} color="#1890FF" />}
                          >
                            {t('common.details')}
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handelRemoveClick(e)}
                            startIcon={<Icon icon={trash2Outline} color="red" />}
                          >
                            {t('common.remove')}
                          </Button>
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
            {t('store.removeTitleStart') + storeSelected?.name + ' ' + t('store.removeTitleEnd')}
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
