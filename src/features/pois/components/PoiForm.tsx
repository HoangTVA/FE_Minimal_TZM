import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { PostPoi } from 'models';
import * as React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { selectPoiTypeOptions } from '../poiSlice';
interface PoiFormProps {
  initialValue: PostPoi;
  onSubmit?: (formValue: PostPoi) => void;
  isEdit: boolean;
}

export default function PoiForm({ initialValue, onSubmit, isEdit }: PoiFormProps) {
  const { t } = useTranslation();
  const poiTypeOptions = useAppSelector(selectPoiTypeOptions);
  //schema
  const schema = yup.object().shape({
    name: yup.string().required(t('poi.errorPoiName')),
    poiCode: yup.string().required(t('poi.errorBrandPoiCode')),
    poiTypeId: yup.number().moreThan(0, t('poi.errorPoiType')).required(t('poi.errorPoiType'))
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<PostPoi>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const handelFormSubmit = (formValues: PostPoi) => {
    if (onSubmit) onSubmit(formValues);
  };
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('poi.infoPoi')}
          </Typography>
          <Stack spacing={3}>
            <InputField
              name="name"
              label={t('poi.poiName') + '*'}
              control={control}
              disabled={isEdit}
            />
            <InputField
              name="poiCode"
              label={t('poi.poiCode') + '*'}
              control={control}
              disabled={isEdit}
            />

            <SelectField
              name="poiTypeId"
              label={t('poi.poiType') + '*'}
              control={control}
              options={poiTypeOptions}
              disabled={isEdit}
            />
          </Stack>
        </Card>
        {isEdit ? (
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
            {t('common.btnSubmit')}
          </LoadingButton>
        )}
      </Stack>
    </form>
  );
}
