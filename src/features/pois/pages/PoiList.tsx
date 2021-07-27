import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
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
import { GetStatusMap, PaginationRequest, Poi, PoiPagingRequest, Store } from 'models';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { poiActions, selectFilter, selectLoading, selectPoiList } from '../poiSlice';
import PoiFilter from '../components/PoiFilter';

// ----------------------------------------------------------------------

export default function PoiList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectPoiList);
  const { statusMap } = GetStatusMap();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  ///effect
  useEffect(() => {
    dispatch(poiActions.fetchPoiList(filter));
  }, [dispatch, filter]);
  //functions
  const onPageChange = (page: number) => {
    dispatch(
      poiActions.setFilter({
        ...filter,
        page: page + 1
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      poiActions.setFilter({
        ...filter,
        pageSize: perPage
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      poiActions.setFilter({
        ...filter,
        colName: colName,
        sortType: sortType
      })
    );
  };
  const handelFilterChange = (newFilter: PoiPagingRequest) => {
    dispatch(poiActions.setFilterWithDebounce(newFilter));
  };
  const handelSearchDebounce = (newFilter: PoiPagingRequest) => {
    dispatch(poiActions.setFilterWithDebounce(newFilter));
  };
  //header
  const { t } = useTranslation();
  const headCells = [
    { id: 'no', label: '#', disableSorting: true },
    { id: 'poiName', label: t('poi.poiName') },
    { id: 'poiCode', label: t('poi.poiCode'), disableSorting: true },
    { id: 'poiType', label: t('poi.poiType'), disableSorting: true },
    { id: 'brandPoi', label: t('poi.brandPois'), disableSorting: true },
    { id: 'status', label: t('common.status'), disableSorting: true },
    { id: 'action', label: t('common.actions'), disableSorting: true, align: 'center' }
  ];

  const { TblContainer, TblHead, TblPagination } = useTable({
    rs,
    headCells,
    filter,
    onPageChange,
    onRowPerPageChange,
    onSortChange
  });
  const handelDetailsClick = (poi: Poi) => {
    navigate(`/${poi.id}`);
  };

  return (
    <Page title={t('poi.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('poi.poiList')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('poi.title'), href: PATH_DASHBOARD.general.poi },
            { name: t('poi.poiList') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.root}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('store.btnAdd')}
            </Button>
          }
        />

        <Card>
          <PoiFilter filter={filter} onSearchChange={handelSearchDebounce} />

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
                      <TableCell align="left">{e.poiCode}</TableCell>
                      <TableCell align="left">{e.poiTypeName}</TableCell>
                      <TableCell align="left">{e.countPoiBrands}</TableCell>
                      <TableCell>
                        <Box color={statusMap[e.status].color} fontWeight="bold">
                          {statusMap[e.status].name}
                        </Box>
                      </TableCell>
                      <TableCell width={250}>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            color="warning"
                            onClick={() => handelDetailsClick(e)}
                            startIcon={<Icon icon={editFill} color="#FFC107" />}
                          >
                            {t('common.details')}
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
    </Page>
  );
}
