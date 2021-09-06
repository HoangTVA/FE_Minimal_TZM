import { Box, Container, Grid } from '@material-ui/core';
import taskApi from 'api/taskAPi';
import teamApi from 'api/teamApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { agentActions } from 'features/agent/agentSlice';
import { orderActions } from 'features/order/orderSlice';
import { poiBrandActions as assetActions, selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { Driver, PostTask, Task } from 'models';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import TaskForm from './TaskForm';

export default function AddEditTaskPage() {
  const { taskId } = useParams();
  const isEdit = Boolean(taskId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [task, setTask] = useState<PostTask>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const user = getCurrentUser();
  useEffect(() => {
    if (!taskId) return;

    //IFFE
    (async () => {
      try {
        const data: Task = await taskApi.getById(taskId);
        const initData: PostTask = {
          orders: data.orders.map((e, idx) => idx) || [],
          drivers: data.batchRoutes.map(
            (e) => ({ id: e.driver.id, capacity: e.totalLoads } as Driver)
          ),
          startDepot: data.depot
        } as PostTask;
        setTask(initData);
      } catch (error) {}
    })();
  }, [taskId]);
  useEffect(() => {
    dispatch(orderActions.fetchOrderList({ status: 0 }));
  }, [dispatch]);
  useEffect(() => {
    dispatch(agentActions.fetchAgentList({ status: 4 }));
  }, [dispatch]);
  const handelStoreFormSubmit = async (formValues: PostTask) => {
    if (!isEdit) {
      //   try {
      //     await teamApi.add(formValues);
      //     enqueueSnackbar(formValues?.name + ' ' + t('team.addSuccess'), { variant: 'success' });
      //     const newFilter = { ...filter };
      //     dispatch(assetActions.setFilter(newFilter));
      //     navigate(PATH_DASHBOARD.team.root);
      //   } catch (error) {
      //     enqueueSnackbar(formValues?.name + ' ' + t('common.errorText'), { variant: 'error' });
      //   }
    } else {
      //   try {
      //     await teamApi.update(taskId, formValues);
      //     enqueueSnackbar(
      //       t('team.updateSuccessStart') + formValues.name + ' ' + t('team.updateSuccessEnd'),
      //       { variant: 'success' }
      //     );
      //     const newFilter = { ...filter };
      //     dispatch(assetActions.setFilter(newFilter));
      //     navigate(PATH_DASHBOARD.team.root);
      //   } catch (error) {
      //     enqueueSnackbar(formValues?.name + ' ' + t('common.errorText'), { variant: 'error' });
      //   }
    }
  };
  const initialValues: PostTask = {
    brandId: user?.brandId,
    creatorId: 1,
    drivers: [],
    orders: [],
    startDepot: {
      address: '',
      city: '',
      code: '',
      district: '',
      latitude: '',
      longitude: '',
      ward: '',
      createdAt: '',
      deletedAt: '',
      updatedAt: ''
    },
    capacity: '',
    agentOptions: [],
    orderOptions: [],
    ...task
  } as PostTask;
  return (
    <Page title={isEdit ? t('task.editTitle') : t('task.addTitle')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('task.editTitle') : t('task.addTitle')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('task.list'), href: PATH_DASHBOARD.task.root },
            {
              name: isEdit ? t('task.editTitle') : t('task.addTitle')
            }
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {(!isEdit || Boolean(task)) && (
                <TaskForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                  isView={false}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
