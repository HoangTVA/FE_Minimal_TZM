import editFill from '@iconify/icons-eva/edit-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
// material
import {
  Avatar,
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
  Stack,
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
// hooks
import useSettings from 'hooks/useSettings';
import { PaginationRequest, Task } from 'models';
import { GetTaskTypeMap } from 'models/dto/taskStatus';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { selectFilter, selectLoading, selectTaskList, taskActions } from '../taskSlice';
// ----------------------------------------------------------------------

export default function TaskList() {
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  const loading = useAppSelector(selectLoading);
  const rs = useAppSelector(selectTaskList);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [teamSelected, setTeamSelected] = useState<Task>();
  const { taskStatusMap } = GetTaskTypeMap();

  //effect
  useEffect(() => {
    dispatch(taskActions.fetchTaskList(filter));
  }, [dispatch, filter]);
  //functions
  const onPageChange = (page: number) => {
    dispatch(
      taskActions.setFilter({
        ...filter,
        page: page + 1
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      taskActions.setFilter({
        ...filter,
        pageSize: perPage
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      taskActions.setFilter({
        ...filter,
        colName: colName,
        sortType: sortType
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(taskActions.setFilterWithDebounce(newFilter));
  };
  //header
  const { t } = useTranslation();

  const headCells = [
    { id: 'id', label: '#', align: 'center', disableSorting: true },
    { id: 'start', label: t('task.start'), align: 'left', disableSorting: true },
    // { id: 'end', label: t('task.end'), align: 'left', disableSorting: true },
    { id: 'orders', label: t('task.orders'), align: 'left', disableSorting: true },
    { id: 'agents', label: t('task.agents'), align: 'left', disableSorting: true },
    { id: 'totalItems', label: t('task.totalItems'), align: 'left', disableSorting: true },
    { id: 'totalDistance', label: t('task.totalDistance'), align: 'left', disableSorting: true },
    { id: 'status', label: t('common.status'), disableSorting: true },
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
  const handelDetailsClick = (team: Task) => {
    navigate(`${PATH_DASHBOARD.team.edit}/${team.id}`);
  };
  const handelRemoveClick = (team: Task) => {
    setTeamSelected(team);
    setConfirmDelete(true);
  };
  const handelConfirmRemoveClick = async () => {
    try {
      await teamApi.remove(Number(teamSelected?.id) || 0);
      const newFilter = { ...filter };
      dispatch(taskActions.setFilter(newFilter));
      enqueueSnackbar(teamSelected?.id + ' ' + t('store.deleteSuccess'), {
        variant: 'success'
      });

      setTeamSelected(undefined);
      setConfirmDelete(false);
    } catch (error) {
      enqueueSnackbar(teamSelected?.id + ' ' + t('common.errorText'), { variant: 'error' });
    }
  };

  return (
    <Page title={t('task.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('task.list')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('task.list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.task.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('task.addTitle')}
            </Button>
          }
        />

        <Card>
          {/* <TaskFilter filter={filter} onSearchChange={handelSearchDebounce} /> */}

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
                      <TableCell align="center" width={70}>
                        {idx + 1}
                      </TableCell>
                      <TableCell align="left">{e.depot?.address || t('store.none')}</TableCell>
                      {/* <TableCell align="left">
                        {e.orders[e.orders.length - 1]?.toStation?.address || t('store.none')}
                      </TableCell> */}
                      <TableCell align="left">{e.orders.length}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {e.batchRoutes.map((x) => (
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={'error'} src={x.driver.image} />
                            <Typography variant="subtitle2" noWrap>
                              {x.driver.username}
                            </Typography>
                          </Stack>
                        ))}
                      </TableCell>
                      <TableCell align="left">
                        {e.batchRoutes.reduce((sum, current) => (sum += current.totalLoads), 0)}
                      </TableCell>
                      <TableCell align="left">
                        {e.batchRoutes.reduce((sum, current) => (sum += current.totalDistance), 0)}
                      </TableCell>
                      <TableCell>
                        <Box color={taskStatusMap[e.status].color} fontWeight="bold">
                          {taskStatusMap[e.status].name}
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
            {t('team.name') + ': ' + teamSelected?.id + ' ' + t('store.removeTitleEnd')}
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
