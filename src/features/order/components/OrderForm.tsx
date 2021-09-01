import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography } from '@material-ui/core';
import { MapDraggable, SearchAddress } from 'components/common';
import InputAreaField from 'components/FormField/InputAreaField';
import InputField from 'components/FormField/InputField';
import { IcMarkerLocation } from 'components/map/MarkerStyles';
import { LatLngExpression } from 'leaflet';
import { Address, NominatimAddress, Order } from 'models';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getAddressDataByLatLngUtils } from 'utils/common';
import * as yup from 'yup';
import LinearAlternativeLabel from './LinearAlternativeLabel';

interface TeamFormProps {
  initialValue: Order;
  onSubmit?: (formValue: Order) => void;
  isEdit: boolean;
}

export default function OrderForm({ initialValue, onSubmit, isEdit }: TeamFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    fromStation: yup.object().shape({
      longitude: yup.string().required(t('common.isRequired')),
      latitude: yup.string().required(t('common.isRequired')),
      address: yup.string().required(t('common.isRequired')),
      district: yup.string().required(t('common.isRequired')),
      ward: yup.string().required(t('common.isRequired')),
      city: yup.string().required(t('common.isRequired'))
    }),
    toStation: yup.object().shape({
      longitude: yup.string().required(t('common.isRequired')),
      latitude: yup.string().required(t('common.isRequired')),
      address: yup.string().required(t('common.isRequired')),
      district: yup.string().required(t('common.isRequired')),
      ward: yup.string().required(t('common.isRequired')),
      city: yup.string().required(t('common.isRequired'))
    }),
    orderCode: yup.string().required(t('common.isRequired')),
    orderInfoObj: yup.object().shape({
      cod: yup.string().required(t('common.isRequired')),
      totalPriceOrder: yup.string().required(t('common.isRequired')),
      weight: yup.string().required(t('common.isRequired')),
      length: yup.string().required(t('common.isRequired')),
      width: yup.string().required(t('common.isRequired')),
      height: yup.string().required(t('common.isRequired')),
      note: yup.string().required(t('common.isRequired')),
      receiverName: yup.string().required(t('common.isRequired')),
      email: yup.string().required(t('common.isRequired')),
      phone: yup.string().required(t('common.isRequired')),
      serviceCharge: yup.string().required(t('common.isRequired'))
    }),
    packageIteams: yup
      .array()
      .of(
        yup.object().shape({
          quantity: yup.string().required(t('common.isRequired')),
          description: yup.string().required(t('common.isRequired')),
          code: yup.string().required(t('common.isRequired')),
          itemInfoObj: yup.object().shape({
            img: yup.string().required(t('common.isRequired')),
            name: yup.string().required(t('common.isRequired'))
          })
        })
      )
      .required()
  });
  const methods = useForm<Order>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;
  const { isDirty } = useFormState({ control });
  const navigate = useNavigate();
  const handelFormSubmit = (formValues: Order) => {
    if (onSubmit) onSubmit(formValues);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handelFormSubmit)}>
        <LinearAlternativeLabel />
      </form>
    </FormProvider>
  );
}
export const FormThree = ({ formContent }) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;
  const { isDirty } = useFormState({ control });

  useEffect(() => {
    reset({ ...formContent.one });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('order.info')}
          </Typography>
          <Stack spacing={3}>
            <InputField
              name="orderCode"
              label={t('order.code') + '*'}
              control={control}
              disabled={true}
            />
            <InputField
              name="orderInfoObj.cod"
              label={t('order.lng') + '*'}
              control={control}
              disabled={true}
            />
            <InputField
              name="orderInfoObj.totalPriceOrder"
              label={t('order.totalPriceOrder') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.weight"
              label={t('order.weight') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.length"
              label={t('order.length') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.width"
              label={t('order.width') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.height"
              label={t('order.height') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.receiverName"
              label={t('order.receiverName') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.email"
              label={t('order.email') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.phone"
              label={t('order.phone') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.serviceCharge"
              label={t('order.serviceCharge') + '*'}
              control={control}
            />
            <InputField
              name="orderInfoObj.incurred"
              label={t('order.incurred') + '*'}
              control={control}
            />
            <InputAreaField
              name="orderInfoObj.note"
              label={t('order.note') + '*'}
              control={control}
            />
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={3}>
            {t('order.latLng')}
          </Typography>
          <Stack spacing={3}></Stack>
        </Card>
      </Grid>
    </Grid>
  );
};
export const FormTwo = ({ formContent }) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const [location, setLocation] = useState<LatLngExpression>();
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;
  const { isDirty } = useFormState({ control });
  useEffect(() => {
    if (!location) return;
    setValue('toStation.latitude', location[0].toString(), {
      shouldDirty: false
    });
    setValue('toStation.longitude', location[1].toString(), {
      shouldDirty: false
    });
    getAddressDataByLatLng(location[0], location[1]);
  }, [location]);
  const getAddressDataByLatLng = async (lat: number, lng: number) => {
    const data: NominatimAddress = await getAddressDataByLatLngUtils(lat, lng);
    setValue('toStation.address', data.display_name || '', {
      shouldDirty: true
    });
    setValue('toStation.district', data.address.town || data.address.county || '', {
      shouldDirty: true
    });
    setValue(
      'toStation.ward',
      data.address.quarter || data.address.suburb || data.address.village || '',
      {
        shouldDirty: true
      }
    );
    setValue('toStation.city', data.address.city || data.address.state || '', {
      shouldDirty: true
    });
    //console.log(data);
  };
  useEffect(() => {
    reset({ ...formContent.one });
  }, []);
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
  };
  const handelOnDragMarker = (point: any) => {
    // setLocationSelected(point['lng'].toString() + ' ' + point['lat'].toString());
    const latLng: LatLngExpression = [point.lat, point.lng];
    setLocation(latLng);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('order.startInfo')}
          </Typography>
          <Stack spacing={3}>
            <InputField
              name="toStation.latitude"
              label={t('common.lat') + '*'}
              control={control}
              disabled={true}
            />
            <InputField
              name="toStation.longitude"
              label={t('common.lng') + '*'}
              control={control}
              disabled={true}
            />
            <InputField
              name="toStation.address"
              label={t('store.address') + '*'}
              control={control}
            />
            <InputField
              name="toStation.city"
              label={t('adminLevel.province') + '*'}
              control={control}
            />
            <InputField
              name="toStation.district"
              label={t('adminLevel.district') + '*'}
              control={control}
            />
            <InputField
              name="toStation.ward"
              label={t('adminLevel.ward') + '*'}
              control={control}
            />
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={3}>
            {t('order.latLng')}
          </Typography>
          <Stack spacing={3}>
            <Box>
              <SearchAddress onChangeAddress={handelSelectLocation} />
              <Box mt={3}>
                <MapDraggable
                  location={location}
                  onDraggable={handelOnDragMarker}
                  icon={IcMarkerLocation}
                />
              </Box>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};
export const FormOne = ({ formContent }) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const [location, setLocation] = useState<LatLngExpression>();
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;
  const { isDirty } = useFormState({ control });
  useEffect(() => {
    if (!location) return;
    setValue('fromStation.latitude', location[0].toString(), {
      shouldDirty: true
    });
    setValue('fromStation.longitude', location[1].toString(), {
      shouldDirty: true
    });
    getAddressDataByLatLng(location[0], location[1]);
  }, [location]);
  const getAddressDataByLatLng = async (lat: number, lng: number) => {
    const data: NominatimAddress = await getAddressDataByLatLngUtils(lat, lng);
    setValue('fromStation.address', data.display_name || '', {
      shouldDirty: true
    });
    setValue('fromStation.district', data.address.town || data.address.county || '', {
      shouldDirty: true
    });
    setValue(
      'fromStation.ward',
      data.address.quarter || data.address.suburb || data.address.village || '',
      {
        shouldDirty: true
      }
    );
    setValue('fromStation.city', data.address.city || data.address.state || '', {
      shouldDirty: true
    });
    //console.log(data);
  };
  useEffect(() => {
    reset({ ...formContent.one });
  }, []);
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
  };
  const handelOnDragMarker = (point: any) => {
    // setLocationSelected(point['lng'].toString() + ' ' + point['lat'].toString());
    const latLng: LatLngExpression = [point.lat, point.lng];
    setLocation(latLng);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('order.startInfo')}
          </Typography>
          <Stack spacing={3}>
            <InputField
              name="fromStation.latitude"
              label={t('common.lat') + '*'}
              control={control}
              disabled={true}
            />
            <InputField
              name="fromStation.longitude"
              label={t('common.lng') + '*'}
              control={control}
              disabled={true}
            />
            <InputField
              name="fromStation.address"
              label={t('store.address') + '*'}
              control={control}
            />
            <InputField
              name="fromStation.city"
              label={t('adminLevel.province') + '*'}
              control={control}
            />
            <InputField
              name="fromStation.district"
              label={t('adminLevel.district') + '*'}
              control={control}
            />
            <InputField
              name="fromStation.ward"
              label={t('adminLevel.ward') + '*'}
              control={control}
            />
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={3}>
            {t('order.latLng')}
          </Typography>
          <Stack spacing={3}>
            <Box>
              <SearchAddress onChangeAddress={handelSelectLocation} />
              <Box mt={3}>
                <MapDraggable
                  location={location}
                  onDraggable={handelOnDragMarker}
                  icon={IcMarkerLocation}
                />
              </Box>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};
