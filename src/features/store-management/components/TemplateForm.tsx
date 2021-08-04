import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardHeader, Stack, TextField, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Box } from '@material-ui/system';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { PostTemplate, Template } from 'models';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { selectStoreTypeOptions, selectTemplatesOptions } from '../storeSlice';
interface TemplateFormProps {
  initialValue: PostTemplate;
  storeName: string;
  selectedTemplateName: string;
  selectTemplate?: Template;
  onSubmit?: (formValue: PostTemplate) => void;
}

export default function TemplateForm({
  initialValue,
  onSubmit,
  storeName,
  selectedTemplateName,
  selectTemplate
}: TemplateFormProps) {
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
    formState: { isSubmitting, errors }
  } = useForm<PostTemplate>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const handelFormSubmit = (formValues: PostTemplate) => {
    if (onSubmit) onSubmit(formValues);
  };
  console.log(initialValue);
  useEffect(() => {
    if (!selectTemplate) return;
    setValue('templateId', selectTemplate.id, {
      shouldDirty: initialValue.templateId === selectTemplate.id ? false : true
    });
  }, [selectTemplate]);
  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom marginBottom={5}>
            {`${t('store.storeName')}: ${storeName}`}
          </Typography>
          <Stack spacing={3}>
            <InputField name="url" label={t('store.url') + '*'} control={control} />
            <Box
              style={{ paddingRight: '12px', paddingLeft: '12px' }}
              sx={{
                my: 3,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                {t('store.selected')}
              </Typography>
              <TextField
                variant="outlined"
                value={selectTemplate?.name || t('store.nonSelect')}
                disabled
                error={Boolean(errors.templateId?.message)}
                helperText={errors.templateId?.message}
              />
            </Box>
            {/* <SelectField
              name="templateId"
              label={t('store.templateId') + '*'}
              control={control}
              options={templatesOptions}
            /> */}
          </Stack>

          <LoadingButton
            style={{ marginTop: '20px' }}
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
