import { yupResolver } from '@hookform/resolvers/yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { Autocomplete, Box, Button, Card, Stack, TextField, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAppSelector } from 'app/hooks';
import InputField from 'components/FormField/InputField';
import { selectStoresOptions } from 'features/store-management/storeSlice';
import { PostTradeZone, StoresName } from 'models';
import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import * as yup from 'yup';
import { selectFreeZoneOptions } from '../tradeZoneSlice';

interface TradeZoneFormProps {
  initialValue: PostTradeZone;
  onSubmit?: (formValue: PostTradeZone) => void;
  isEdit: boolean;
  listPost: number[];
}

export default function TradeZoneForm({
  initialValue,
  onSubmit,
  isEdit,
  listPost
}: TradeZoneFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    name: yup.string().required(t('tz.errorNameTz'))
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<PostTradeZone>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });

  const navigate = useNavigate();
  const fzOptions = useAppSelector(selectFreeZoneOptions);
  const selectedBox = fzOptions.filter(({ id }) => listPost.includes(id));
  const storesOptions = useAppSelector(selectStoresOptions);
  console.log(initialValue.storesName);
  const [storeSelect, setStoreSelect] = useState<StoresName[]>(initialValue.storesName || []);

  const handelFormSubmit = (formValues: PostTradeZone) => {
    formValues.listZoneId = [...selectedBox.map((e) => e.id)];
    formValues.stores = [...storeSelect];
    if (onSubmit) onSubmit(formValues);
  };
  const handelStoreSelected = (e, value) => {
    setStoreSelect(value);
  };

  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('tz.infoTz')}
          </Typography>
          <Stack spacing={3}>
            <InputField name="name" label={t('tz.name') + '*'} control={control} />
            <Autocomplete
              fullWidth
              multiple
              limitTags={10}
              id="multiple-limit-tags"
              options={fzOptions}
              getOptionLabel={(option) => option.name}
              defaultValue={[]}
              value={selectedBox}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label={t('groupZone.selected')} />
              )}
            />
            <Autocomplete
              fullWidth
              id="multiple-limit-tags1"
              key={'id'}
              multiple
              limitTags={10}
              onChange={handelStoreSelected}
              options={storesOptions}
              getOptionLabel={(option) => option.name}
              defaultValue={storeSelect || []}
              //value={selectedBox}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label={t('tz.storesApply')} />
              )}
            />
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
                navigate(`${PATH_DASHBOARD.tradeZone.tradeZones}`);
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
      </Stack>
    </form>
  );
}
