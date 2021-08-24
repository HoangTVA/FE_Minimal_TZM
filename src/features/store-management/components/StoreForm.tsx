import { Box, Card, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { PostStore } from 'models';
import * as React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { selectStoreTypeOptions } from '../storeSlice';
import { useEffect } from 'react';
import { LatLngExpression } from 'leaflet';
import { useDebouncedCallback } from 'components/common';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputAreaField from 'components/FormField/InputAreaField';
interface StoreFormProps {
  initialValue: PostStore;
  location?: LatLngExpression;
  onSubmit?: (formValue: PostStore) => void;
  onImageChange?: (value: string) => void;
  isEdit: boolean;
  isView?: boolean;
}

export default function StoreForm({
  initialValue,
  onSubmit,
  onImageChange,
  location,
  isEdit,
  isView
}: StoreFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    name: yup.string().required(t('store.errorStoreName')),
    imageUrl: yup.string().required(t('store.errorImg')),
    coordinateString: yup.string().required(t('store.errorLocation')),
    address: yup.string().required(t('store.errorAddress')),
    storeCode: yup.string().required(t('store.errorStoreCode')),
    storeTypeId: yup
      .number()
      .moreThan(0, t('store.errorStoreType'))
      .required(t('store.errorStoreType'))
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<PostStore>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const storeTypeOptions = useAppSelector(selectStoreTypeOptions);
  const handelFormSubmit = (formValues: PostStore) => {
    if (onSubmit) onSubmit(formValues);
  };
  const handelInputFieldImgChange = useDebouncedCallback((e) => {
    if (!onImageChange) return;
    onImageChange(e.target.value);
  }, 500);

  useEffect(() => {
    if (!location) return;
    setValue('coordinateString', location[1].toString() + ' ' + location[0].toString(), {
      shouldDirty: false
    });
  }, [location]);
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('store.info')}
          </Typography>
          <Stack spacing={3}>
            <InputField
              name="storeCode"
              label={t('store.storeCode') + '*'}
              control={control}
              disabled={isView}
            />
            <InputField
              name="name"
              label={t('store.storeName') + '*'}
              control={control}
              disabled={isView}
            />

            <InputField
              name="coordinateString"
              label={t('store.location') + '*'}
              control={control}
              disabled
            />
            <InputField
              name="imageUrl"
              label={t('store.img') + '*'}
              control={control}
              onChange={handelInputFieldImgChange}
              disabled={isView}
            />
            <InputAreaField
              name="address"
              label={t('store.address') + '*'}
              control={control}
              disabled={isView}
            />
            <Box mt={2}>
              <SelectField
                name="storeTypeId"
                label={t('store.storeTypeName') + '*'}
                control={control}
                options={storeTypeOptions}
                disabled={isView}
              />
            </Box>
          </Stack>
        </Card>
        {isView ? (
          <></>
        ) : (
          <LoadingButton
            disabled={!isDirty}
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={isSubmitting}
          >
            {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
          </LoadingButton>
        )}
      </Stack>
    </form>
  );
}
