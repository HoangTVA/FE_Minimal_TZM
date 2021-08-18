import { yupResolver } from '@hookform/resolvers/yup';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { Autocomplete, Box, Button, Stack, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useAppSelector } from 'app/hooks';
import InputAreaField from 'components/FormField/InputAreaField';
import InputField from 'components/FormField/InputField';
import SelectField from 'components/FormField/SelectField';
import { selectGroupZoneOptions } from 'features/group-zone/groupZoneSlice';
import { TzVersion } from 'models';
import { GetConstantTimeFilter, OptionsTimeFilter } from 'models/dto/timeFilter';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { convertBinaryFilterToList, convertListToBinaryFilter } from 'utils/common';
import * as yup from 'yup';
interface TzVersionProps {
  initialValue: TzVersion;
  onSubmit?: (formValue: TzVersion) => void;
  isView?: boolean;
  isEdit: boolean;
}

export default function TzVersionViewEditForm({
  initialValue,
  onSubmit,
  isView,
  isEdit
}: TzVersionProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    name: yup.string().required(t('store.errorStoreName')),
    description: yup.string().notRequired(),
    dateFilter: yup.string().required(t('store.errorStoreName')),
    timeSlot: yup.string().required(t('store.errorStoreName')),
    groupZoneId: yup
      .number()
      .moreThan(0, t('store.errorStoreType'))
      .required(t('store.errorStoreType'))
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors }
  } = useForm<TzVersion>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const { timeFilterOptions, dateFilterOptions } = GetConstantTimeFilter();
  const dateSelected = convertBinaryFilterToList(initialValue?.dateFilter);
  const timeSelected = convertBinaryFilterToList(initialValue?.timeSlot);
  const dateSelectedList = dateFilterOptions.filter(({ id }) => dateSelected.includes(id));
  const timeSelectedList = timeFilterOptions.filter(({ id }) => timeSelected.includes(id));
  const navigate = useNavigate();
  const groupZoneOptions = useAppSelector(selectGroupZoneOptions);
  const handelFormSubmit = (formValues: TzVersion) => {
    if (onSubmit) onSubmit(formValues);
  };
  const handelDateSelected = (e, value) => {
    const dateFilter = convertListToBinaryFilter(7, value as OptionsTimeFilter[]);
    setValue('dateFilter', dateFilter === '0000000' ? '' : dateFilter, {
      shouldDirty: true
    });
  };
  const handelTimeSelected = (e, value) => {
    const timeFilter = convertListToBinaryFilter(24, value as OptionsTimeFilter[]);
    setValue('timeSlot', timeFilter === '000000000000000000000000' ? '' : timeFilter, {
      shouldDirty: true
    });
  };

  return (
    <form onSubmit={handleSubmit(handelFormSubmit)}>
      <Stack spacing={3}>
        {isView && <Box mt={2}></Box>}

        {/* {!isView && (
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('tz.info')}
          </Typography>
        )} */}

        <Stack spacing={3}>
          {isView && <InputField name="id" label={'#Id'} control={control} disabled={isView} />}
          <InputField
            name="name"
            label={t('tz.tzVerName') + '*'}
            control={control}
            disabled={isView}
          />
          <Autocomplete
            fullWidth
            multiple
            defaultValue={dateSelectedList}
            //value={date}
            onChange={isView ? () => {} : handelDateSelected}
            options={dateFilterOptions}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('tz.dateFilter') + '*'}
                error={Boolean(errors.dateFilter?.message)}
                helperText={errors.dateFilter?.message}
              />
            )}
          />
          <Autocomplete
            fullWidth
            multiple
            defaultValue={timeSelectedList}
            //value={time}
            onChange={isView ? () => {} : handelTimeSelected}
            options={timeFilterOptions}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('tz.timeFilter') + '*'}
                error={Boolean(errors.timeSlot?.message)}
                helperText={errors.timeSlot?.message}
              />
            )}
          />
          <SelectField
            name="groupZoneId"
            label={t('groupZone.name') + '*'}
            control={control}
            options={groupZoneOptions}
            disabled={isView}
          />

          {isView && (
            <>
              <Autocomplete
                fullWidth
                multiple
                defaultValue={[]}
                value={initialValue.storesName.map((el) => ({ id: el.id, name: el.name }))}
                //onChange={isView ? () => {} : handelTimeSelected}
                options={initialValue.storesName.map((el) => ({ id: el.id, name: el.name }))}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label={t('tz.storesApply')} />}
              />
              <InputField
                name="groupZoneName"
                label={t('groupZone.name')}
                control={control}
                disabled={isView}
              />
              <TextField
                fullWidth
                label={t('common.status')}
                value={initialValue.isActive ? t('tz.active') : t('tz.unActive')}
                disabled
              />
            </>
          )}
          <InputAreaField
            name="description"
            label={t('common.description')}
            control={control}
            disabled={isView}
          />
        </Stack>

        {isView ? (
          <></>
        ) : (
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
                navigate(`${PATH_DASHBOARD.tradeZone.tradeZoneVersion}`);
              }}
              startIcon={<Icon icon={arrowCircleLeftOutline} />}
              style={{ marginRight: '15px' }}
            >
              {t('content.backHomePage')}
            </Button>
            <LoadingButton
              type="submit"
              disabled={!isDirty}
              variant="contained"
              size="large"
              loading={isSubmitting}
              startIcon={<Icon icon={saveFill} />}
            >
              {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
            </LoadingButton>
          </Box>
          // <LoadingButton
          //   disabled={!isDirty}
          //   type="submit"
          //   fullWidth
          //   variant="contained"
          //   size="large"
          //   loading={isSubmitting}
          // >
          //   {t('common.btnUpdate')}
          // </LoadingButton>
        )}
      </Stack>
    </form>
  );
}
