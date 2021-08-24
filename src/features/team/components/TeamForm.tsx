import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField, { SelectOptions } from 'components/FormField/SelectField';
import { selectStoresOptions } from 'features/store-management/storeSlice';
import { Team, GetAssetType } from 'models';
import * as React from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from 'routes/paths';
import { useNavigate } from 'react-router';

interface TeamFormProps {
  initialValue: Team;
  onSubmit?: (formValue: Team) => void;
  isEdit: boolean;
}

export default function TeamForm({ initialValue, onSubmit, isEdit }: TeamFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    name: yup.string().required(t('team.errorName'))
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<Team>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const navigate = useNavigate();
  const handelFormSubmit = (formValues: Team) => {
    if (onSubmit) onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('team.info')}
          </Typography>
          <Stack spacing={3}>
            <InputField name="name" label={t('team.name') + '*'} control={control} />
          </Stack>
          <Box
            style={{
              display: 'flex',
              flexFlow: 'row nowrap',
              justifyContent: 'flex-end',
              alignContent: 'center',
              backgroundColor: '#fff',
              marginTop: '15px'
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                navigate(`${PATH_DASHBOARD.team.root}`);
              }}
              startIcon={<Icon icon={arrowCircleLeftOutline} />}
              style={{ marginRight: '15px' }}
            >
              {t('content.backHomePage')}
            </Button>
            <LoadingButton
              disabled={!isDirty}
              loading={isSubmitting}
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Icon icon={saveFill} />}
            >
              {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
            </LoadingButton>
          </Box>
        </Card>

        {/* <LoadingButton
          disabled={!isDirty}
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
        </LoadingButton> */}
      </Stack>
    </form>
  );
}
