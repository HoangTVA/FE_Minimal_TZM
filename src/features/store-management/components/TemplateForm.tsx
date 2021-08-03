import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardHeader, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { PostTemplate } from 'models';
import * as React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { selectStoreTypeOptions, selectTemplatesOptions } from '../storeSlice';
interface TemplateFormProps {
  initialValue: PostTemplate;
  storeName: string;
  onSubmit?: (formValue: PostTemplate) => void;
}

export default function TemplateForm({ initialValue, onSubmit, storeName }: TemplateFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    url: yup.string().required(t('store.errorUrl')),
    templateId: yup
      .number()
      .moreThan(0, t('store.errorTemplate'))
      .required(t('store.errorTemplate'))
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<PostTemplate>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const templatesOptions = useAppSelector(selectTemplatesOptions);
  const handelFormSubmit = (formValues: PostTemplate) => {
    if (onSubmit) onSubmit(formValues);
  };
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom marginBottom={5}>
            {`${t('store.storeName')}: ${storeName}`}
          </Typography>
          <Stack spacing={3}>
            <InputField name="url" label={t('store.url') + '*'} control={control} />
            <SelectField
              name="templateId"
              label={t('store.templateId') + '*'}
              control={control}
              options={templatesOptions}
            />
          </Stack>
          <LoadingButton
            style={{ marginTop: '10px' }}
            disabled={!isDirty}
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={isSubmitting}
          >
            {t('common.btnUpdate')}
          </LoadingButton>
        </Card>
      </Stack>
    </form>
  );
}
