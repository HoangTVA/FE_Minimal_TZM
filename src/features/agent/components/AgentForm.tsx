import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, FormHelperText, Grid, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import SelectField, { SelectOptions } from 'components/FormField/SelectField';
import { selectStoresOptions } from 'features/store-management/storeSlice';
import { Agent, GetAssetType } from 'models';
import { useCallback, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from 'routes/paths';
import { useNavigate } from 'react-router';
import UploadAvatar from 'components/UploadAvatar';
import { fData } from 'utils/formatNumber';
import { selectTeamsOptions } from 'features/team/teamSlice';
import { GetAgentTypeMap } from 'models/dto/agentType';
import { GetTransportTypeMap } from 'models/dto/transportType';
import InputAreaField from 'components/FormField/InputAreaField';

interface AgentFormProps {
  initialValue: Agent;
  onSubmit?: (formValue: Agent) => void;
  isEdit: boolean;
  isView: boolean;
}
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export default function AgentForm({ initialValue, onSubmit, isEdit, isView }: AgentFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    username: yup.string().required(t('common.isRequired')),
    password: yup.string().required(t('common.isRequired')),
    firstName: yup.string().required(t('common.isRequired')),
    lastName: yup.string().required(t('common.isRequired')),
    email: yup.string().email(t('common.emailError')).max(255).required(t('common.isRequired')),
    phone: yup
      .string()
      .required(t('common.isRequired'))
      .matches(phoneRegExp, t('common.phoneError')),
    address: yup.string().required(t('common.isRequired')),
    licencePlate: yup.string().required(t('common.isRequired')),
    color: yup.string().required(t('common.isRequired')),
    teamId: yup.number().moreThan(0, t('common.isRequiredOptions')).required(t('asset.errorType')),
    agentType: yup
      .number()
      .moreThan(0, t('common.isRequiredOptions'))
      .required(t('common.isRequiredOptions')),
    transportType: yup
      .number()
      .moreThan(0, t('common.isRequiredOptions'))
      .required(t('common.isRequiredOptions')),
    previewImage: yup.mixed().notRequired()
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue
  } = useForm<Agent>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const navigate = useNavigate();
  const teamOptions = useAppSelector(selectTeamsOptions);
  const { agentTypeFilter } = GetAgentTypeMap();
  const { transportTypeFilter } = GetTransportTypeMap();
  const [image, setImage] = useState<any>();
  const [imagePost, setImagePost] = useState<any>();
  const handelFormSubmit = (formValues: Agent) => {
    formValues.ImageFile = imagePost;
    if (onSubmit) onSubmit(formValues);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'previewImage',
          {
            ...file,
            preview: URL.createObjectURL(file)
          },
          {
            shouldDirty: true
          }
        );
      }
      try {
        setImage({ ...file, preview: URL.createObjectURL(file) });
        setImagePost(file);
      } catch (error) {
        return;
      }
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 3, px: 3 }}>
            <Typography variant="h6" gutterBottom marginBottom={4}>
              {t('store.imageUrl')}
            </Typography>
            <Box sx={{ mb: 5 }}>
              <UploadAvatar
                disabled={isView}
                accept="image/*"
                file={image !== undefined ? image : initialValue.image}
                maxSize={3145728}
                onDrop={handleDrop}
                error={Boolean(errors.ImageFile?.message)}
                caption={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    {t('common.allowImage')} *.jpeg, *.jpg, *.png, *.gif
                    <br /> {t('common.maxSize')} {fData(3145728)}
                  </Typography>
                }
              />
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {errors.ImageFile?.message}
              </FormHelperText>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom marginBottom={4}>
              {t('agent.info')}
            </Typography>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <InputField
                  name="firstName"
                  label={t('agent.firstname') + '*'}
                  control={control}
                  disabled={isView}
                />
                <InputField
                  name="lastName"
                  label={t('agent.lastname') + '*'}
                  control={control}
                  disabled={isView}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <InputField
                  name="phone"
                  label={t('agent.phone') + '*'}
                  control={control}
                  type="number"
                  disabled={isView}
                />
                <InputField name="email" label={'Email*'} control={control} disabled={isView} />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <InputField
                  name="username"
                  label={t('login.username') + '*'}
                  control={control}
                  disabled={isView}
                />
                <InputField
                  name="password"
                  label={t('login.password') + '*'}
                  control={control}
                  type="password"
                  disabled={isView}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <SelectField
                  name="teamId"
                  label={t('team.name') + '*'}
                  control={control}
                  options={teamOptions}
                  disabled={isView}
                />
                <SelectField
                  name="agentType"
                  label={t('agent.agentType') + '*'}
                  control={control}
                  options={agentTypeFilter as SelectOptions[]}
                  disabled={isView}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <SelectField
                  name="transportType"
                  label={t('agent.transportType') + '*'}
                  control={control}
                  options={transportTypeFilter as SelectOptions[]}
                  disabled={isView}
                />
                <InputField
                  name="licencePlate"
                  label={t('agent.licencePlate') + '*'}
                  control={control}
                  disabled={isView}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <Box style={{ width: '100%' }}>
                  <Stack spacing={3}>
                    <InputField
                      name="color"
                      label={t('agent.color') + '*'}
                      control={control}
                      disabled={isView}
                    />
                    <InputField
                      name="transportDescription"
                      label={t('agent.transportDescription')}
                      control={control}
                      disabled={isView}
                    />
                  </Stack>
                </Box>
                <InputAreaField
                  name="address"
                  label={t('store.address') + '*'}
                  control={control}
                  disabled={isView}
                  row={4}
                />
              </Stack>

              {!isView && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      navigate(`${PATH_DASHBOARD.asset.assets}`);
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
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}
