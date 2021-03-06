import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import InputAreaField from 'components/FormField/InputAreaField';
import InputField from 'components/FormField/InputField';
import { PostPoiBrand } from 'models';
import * as React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
interface PoiBrandFormProps {
  initialValue: PostPoiBrand;
  onSubmit?: (formValue: PostPoiBrand) => void;
  isEdit: boolean;
}

export default function PoiBrandForm({ initialValue, onSubmit, isEdit }: PoiBrandFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    alias: yup.string().required(t('store.errorAlias')),
    notes: yup.string().notRequired(),
    brandPoiCode: yup.string().required(t('store.errorStoreCode'))
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<PostPoiBrand>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const handelFormSubmit = (formValues: PostPoiBrand) => {
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
            <InputField name="alias" label={t('poi.alias') + '*'} control={control} />
            <InputField name="brandPoiCode" label={t('poi.poiCode') + '*'} control={control} />

            <InputAreaField name="notes" label={t('poi.note')} control={control} />
          </Stack>
        </Card>
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
      </Stack>
    </form>
  );
}
