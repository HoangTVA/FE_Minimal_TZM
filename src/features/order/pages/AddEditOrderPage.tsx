import { Box, Container, Grid } from '@material-ui/core';
import orderApi from 'api/orderApi';
import teamApi from 'api/teamApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import { poiBrandActions as assetActions, selectFilter } from 'features/pois-brand/poiBrandSlice';
import useSettings from 'hooks/useSettings';
import { Order } from 'models';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import OrderForm from '../components/OrderForm';
import './style.css';

export default function AddEditOrderPage() {
  const { orderId } = useParams();
  const isEdit = Boolean(orderId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [order, setOrder] = useState<Order>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const user = getCurrentUser();
  useEffect(() => {
    if (!orderId) return;

    //IFFE
    (async () => {
      try {
        const data: Order = await orderApi.getById(orderId);
        setOrder(data);
      } catch (error) {}
    })();
  }, [orderId]);
  const handelStoreFormSubmit = async (formValues: Order) => {
    if (!isEdit) {
      try {
        await orderApi.add(formValues);
        formValues.orderInfo = JSON.stringify(formValues.orderInfoObj);
        enqueueSnackbar(formValues?.orderCode + ' ' + t('team.addSuccess'), { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(assetActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.team.root);
      } catch (error) {
        enqueueSnackbar(formValues?.orderCode + ' ' + t('common.errorText'), { variant: 'error' });
      }
    } else {
      // try {
      //   await orderApi.update(orderId, formValues);
      //   enqueueSnackbar(
      //     t('team.updateSuccessStart') + formValues.orderCode + ' ' + t('team.updateSuccessEnd'),
      //     { variant: 'success' }
      //   );
      //   const newFilter = { ...filter };
      //   dispatch(assetActions.setFilter(newFilter));
      //   navigate(PATH_DASHBOARD.team.root);
      // } catch (error) {
      //   enqueueSnackbar(formValues?.orderCode + ' ' + t('common.errorText'), { variant: 'error' });
      // }
    }
  };
  const initialValues: Order = {
    batchId: '',
    fromStation: {
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
    toStation: {
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
    orderInfoObj: {
      cod: 0,
      email: '',
      height: 0,
      incurred: 0,
      length: 0,
      note: '',
      phone: '',
      receiverName: '',
      serviceCharge: 0,
      totalPriceOrder: 0,
      weight: 0,
      width: 0
    },
    orderCode: '',
    orderInfo: '',
    packageItems: [],
    status: '',
    createdAt: '',
    fromStationId: '',
    toStationId: '',
    updatedAt: '',
    ...order
  } as Order;
  return (
    <Page title={isEdit ? t('order.titleEdit') : t('order.titleAdd')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('order.titleEdit') : t('order.titleAdd')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('order.list'), href: PATH_DASHBOARD.order.root },
            {
              name: isEdit ? order?.orderCode || '' : t('order.titleAdd')
            }
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {(!isEdit || Boolean(order)) && (
                <OrderForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
