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
import { selectAgentOptions } from 'features/agent/agentSlice';
import { selectGroupZoneOptions } from 'features/group-zone/groupZoneSlice';
import { selectOrderOptions } from 'features/order/orderSlice';
import { AgentOptions, Driver, OrderOptions, PostTask } from 'models';
import { GetConstantTimeFilter, OptionsTimeFilter } from 'models/dto/timeFilter';
import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { convertBinaryFilterToList, convertListToBinaryFilter } from 'utils/common';
import * as yup from 'yup';
interface TaskFormProps {
  initialValue: PostTask;
  onSubmit?: (formValue: PostTask) => void;
  isView?: boolean;
  isEdit: boolean;
}

export default function TaskForm({ initialValue, onSubmit, isView, isEdit }: TaskFormProps) {
  const { t } = useTranslation();
  //schema
  const schema = yup.object().shape({
    orderOptions: yup.array().required(t('common.isRequiredOptions')),
    agentOptions: yup.array().required(t('common.isRequiredOptions')),
    startDepot: yup.object().shape({
      longitude: yup.string().required(t('common.isRequired')),
      latitude: yup.string().required(t('common.isRequired')),
      address: yup.string().required(t('common.isRequired')),
      district: yup.string().required(t('common.isRequired')),
      ward: yup.string().required(t('common.isRequired')),
      city: yup.string().required(t('common.isRequired'))
    }),
    capacity: yup.number().positive(t('common.isNumberPositive')).required(t('common.isRequired'))
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors }
  } = useForm<PostTask>({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const { isDirty } = useFormState({ control });
  const { timeFilterOptions, dateFilterOptions } = GetConstantTimeFilter();
  const [agentSelect, setAgentSelect] = useState<AgentOptions[]>(initialValue.orderOptions || []);
  const [ordersSelect, setOrdersSelect] = useState<OrderOptions[]>(initialValue.agentOptions || []);
  const agentOptions = useAppSelector(selectAgentOptions);
  const ordersOption = useAppSelector(selectOrderOptions);
  const navigate = useNavigate();

  const handelAgentSelected = (e, value) => {
    setAgentSelect(value);
  };
  const handelOrderSelected = (e, value) => {
    setOrdersSelect(value);
  };
  const handelFormSubmit = (formValues: PostTask) => {
    if (onSubmit) onSubmit(formValues);
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
          <Autocomplete
            fullWidth
            id="order-select"
            key={'order-select-id'}
            multiple
            limitTags={10}
            onChange={handelOrderSelected}
            options={ordersOption}
            getOptionLabel={(option) => option.name}
            defaultValue={ordersSelect || []}
            //value={selectedBox}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={t('common.order')} />
            )}
          />
          <Autocomplete
            fullWidth
            id="agent-select"
            key={'agent-select-id'}
            multiple
            limitTags={10}
            onChange={handelAgentSelected}
            options={agentOptions}
            getOptionLabel={(option) => option.name}
            defaultValue={agentSelect || []}
            //value={selectedBox}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={t('task.agents')} />
            )}
          />
          <InputField
            name="capacity"
            label={t('task.capacity') + '*'}
            control={control}
            type="number"
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
