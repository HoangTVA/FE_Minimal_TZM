import { yupResolver } from '@hookform/resolvers/yup';
import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
import {
  Box,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@material-ui/core';
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
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
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
      cod: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      totalPriceOrder: yup
        .number()
        .positive(t('common.isNumberPositive'))
        .required(t('common.isRequired')),
      weight: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      length: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      width: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      height: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired')),
      note: yup.string().notRequired(),
      receiverName: yup.string().required(t('common.isRequired')),
      email: yup.string().email(t('common.emailError')).max(255).required(t('common.isRequired')),
      phone: yup
        .string()
        .required(t('common.isRequired'))
        .matches(phoneRegExp, t('common.phoneError')),
      serviceCharge: yup
        .number()
        .positive(t('common.isNumberPositive'))
        .required(t('common.isRequired')),
      incurred: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired'))
    }),
    packageItems: yup
      .array()
      .of(
        yup.object().shape({
          quantity: yup
            .number()
            .positive(t('common.isNumberPositive'))
            .required(t('common.isRequired')),
          description: yup.string().required(t('common.isRequired')),
          code: yup.string().required(t('common.isRequired'))
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
  const handelFormSubmit = (formValues: Order) => {
    if (onSubmit) onSubmit(formValues);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handelFormSubmit)}>
        <LinearAlternativeLabel isDirty={isDirty} isSubmitting={isSubmitting} />
      </form>
    </FormProvider>
  );
}
export const FormThree = ({ formContent }) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const [listItems, setListItems] = useState<number[]>([0]);

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = methods;
  const { isDirty } = useFormState({ control });
  const handelAddItem = () => {
    const newList = [...listItems];
    newList.push(newList.length);
    setListItems(newList);
  };
  const handelRemoveItem = (index: number) => {
    const newList = [...listItems];
    newList.splice(index, 1);
    setValue(`packageItems[${index}].code`, '', {
      shouldDirty: true
    });
    setValue(`packageItems[${index}].quantity`, '', {
      shouldDirty: true
    });
    setValue(`packageItems[${index}].description`, '', {
      shouldDirty: true
    });
    setListItems(newList);
  };
  const renderFormItem = (index) => {
    return (
      <Box
        style={{
          border: '1px solid',
          borderRadius: '10px',
          borderStyle: 'dashed',
          padding: '16px',
          marginBottom: '16px'
        }}
      >
        <CardHeader
          style={{ padding: '0px 0px 16px 0px' }}
          action={
            <Tooltip key={`remove-${index}`} title={t('common.remove') || ''}>
              <IconButton
                disabled={listItems.length === 1}
                color="error"
                onClick={() => handelRemoveItem(index)}
              >
                <Icon icon={trash2Outline} />
              </IconButton>
            </Tooltip>
          }
          title={`${t('order.item')} ${index + 1}`}
        />
        <Stack spacing={3}>
          <InputField
            name={`packageItems[${index}].code`}
            label={t('order.codeItem') + '*'}
            control={control}
          />
          <InputField
            name={`packageItems[${index}].quantity`}
            label={t('order.quantity') + '*'}
            control={control}
          />
          <InputField
            name={`packageItems[${index}].description`}
            label={t('order.description') + '*'}
            control={control}
          />
        </Stack>
      </Box>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('order.info')}
          </Typography>
          <Stack spacing={3}>
            <InputField name="orderCode" label={t('order.code') + '*'} control={control} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <InputField
                name="orderInfoObj.totalPriceOrder"
                label={t('order.totalPriceOrder') + '*'}
                control={control}
                type="number"
              />
              <InputField
                name="orderInfoObj.cod"
                label={t('order.cod') + '*'}
                control={control}
                type="number"
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <InputField
                name="orderInfoObj.length"
                label={t('order.length') + '*'}
                control={control}
                type="number"
              />
              <InputField
                name="orderInfoObj.width"
                label={t('order.width') + '*'}
                control={control}
                type="number"
              />

              <InputField
                name="orderInfoObj.height"
                label={t('order.height') + '*'}
                control={control}
                type="number"
              />
              <InputField
                name="orderInfoObj.weight"
                label={t('order.weight') + '*'}
                control={control}
                type="number"
              />
            </Stack>

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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <InputField
                name="orderInfoObj.serviceCharge"
                label={t('order.serviceCharge') + '*'}
                control={control}
                type="number"
              />
              <InputField
                name="orderInfoObj.incurred"
                label={t('order.incurred') + '*'}
                control={control}
                type="number"
              />
            </Stack>

            <InputAreaField name="orderInfoObj.note" label={t('order.note')} control={control} />
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <CardHeader
            style={{ padding: '0px 0px 16px 0px' }}
            action={
              <Tooltip key={`add-new-item`} title={t('order.addItem') || ''}>
                <IconButton color="success" onClick={handelAddItem}>
                  <Icon icon={plusFill} />
                </IconButton>
              </Tooltip>
            }
            title={t('order.itemList')}
          />
          {listItems.map((e) => renderFormItem(e))}
        </Card>
      </Grid>
    </Grid>
  );
};
export const FormTwo = ({ formContent }) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const [location, setLocation] = useState<LatLngExpression>();
  const { control, reset, setValue } = methods;
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
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
  };
  const handelOnDragMarker = (point: any) => {
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
  const { control, reset, setValue } = methods;
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
