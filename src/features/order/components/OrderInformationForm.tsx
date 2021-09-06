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
import InputAreaField from 'components/FormField/InputAreaField';
import InputField from 'components/FormField/InputField';
import { OrderInfo } from 'models';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
interface OrderInformationFormProps {
  isView: boolean;
}

export const OrderInformationForm = ({ isView }: OrderInformationFormProps) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const [listItems, setListItems] = useState<number[]>([0]);

  const { control, setValue, getValues } = methods;
  useEffect(() => {
    if (isView) {
      const list = getValues('packageItems');
      const newList = list.map((e, idx) => idx);
      const infoObj = getValues('orderInfo');
      try {
        const obj: OrderInfo = JSON.parse(infoObj);
        setValue('orderInfoObj', obj, {
          shouldDirty: true
        });
      } catch (error) {}

      setListItems(newList);
    }
  }, [getValues, isView]);
  const handelAddItem = () => {
    if (isView) return;
    const newList = [...listItems];
    newList.push(newList.length);
    setListItems(newList);
  };
  const handelRemoveItem = (index: number) => {
    if (isView) return;
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
        key={`box-${index}`}
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
              <span>
                <IconButton
                  disabled={listItems.length === 1}
                  color="error"
                  onClick={() => handelRemoveItem(index)}
                >
                  <Icon icon={trash2Outline} />
                </IconButton>
              </span>
            </Tooltip>
          }
          title={`${t('order.item')} ${index + 1}`}
        />
        <Stack spacing={3}>
          <InputField
            name={`packageItems[${index}].code`}
            label={t('order.codeItem') + '*'}
            control={control}
            disabled={isView}
          />
          <InputField
            name={`packageItems[${index}].quantity`}
            label={t('order.quantity') + '*'}
            type="number"
            control={control}
            disabled={isView}
          />
          <InputField
            name={`packageItems[${index}].description`}
            label={t('order.description') + '*'}
            control={control}
            disabled={isView}
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
            <InputField
              name="orderCode"
              label={t('order.code') + '*'}
              control={control}
              disabled={isView}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <InputField
                name="orderInfoObj.totalPriceOrder"
                label={t('order.totalPriceOrder') + '*'}
                control={control}
                type="number"
                disabled={isView}
              />
              <InputField
                name="orderInfoObj.cod"
                label={t('order.cod') + '*'}
                control={control}
                type="number"
                disabled={isView}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <InputField
                name="orderInfoObj.length"
                label={t('order.length') + '*'}
                control={control}
                type="number"
                disabled={isView}
              />
              <InputField
                name="orderInfoObj.width"
                label={t('order.width') + '*'}
                control={control}
                type="number"
                disabled={isView}
              />

              <InputField
                name="orderInfoObj.height"
                label={t('order.height') + '*'}
                control={control}
                type="number"
                disabled={isView}
              />
              <InputField
                name="orderInfoObj.weight"
                label={t('order.weight') + '*'}
                control={control}
                type="number"
                disabled={isView}
              />
            </Stack>

            <InputField
              name="orderInfoObj.receiverName"
              label={t('order.receiverName') + '*'}
              control={control}
              disabled={isView}
            />
            <InputField
              name="orderInfoObj.email"
              label={t('order.email') + '*'}
              control={control}
              disabled={isView}
            />
            <InputField
              name="orderInfoObj.phone"
              label={t('order.phone') + '*'}
              control={control}
              disabled={isView}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <InputField
                name="orderInfoObj.serviceCharge"
                label={t('order.serviceCharge') + '*'}
                control={control}
                type="number"
                disabled={isView}
              />
              <InputField
                name="orderInfoObj.incurred"
                label={t('order.incurred') + '*'}
                control={control}
                type="number"
              />
            </Stack>

            <InputAreaField
              name="orderInfoObj.note"
              label={t('order.note')}
              control={control}
              disabled={isView}
            />
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
