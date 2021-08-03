import {
  Card,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@material-ui/core';
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
import { Attr } from 'models/dto/attrResponse';
import RadioGroupField from 'components/FormField/RadioGroupField';
import CheckField from 'components/FormField/CheckField';
interface AttrFormProps {
  initialValue: Attr[];
  isView: boolean;
  onSubmit?: (formValue: PostStore) => void;
}

export default function AttrForm({ initialValue, onSubmit, isView }: AttrFormProps) {
  const { t } = useTranslation();
  const handleSubmit = (formValues) => {
    formValues.preventDefault();
    console.log(formValues);
    //if (onSubmit) onSubmit(formValues);
  };
  const renderControl = (attr: Attr) => {
    switch (attr.formatField.type) {
      case 'select': {
        return (
          <Select
            labelId={`${attr.name}_label`}
            key={attr.name}
            label={attr.name}
            value={attr.value === '0' ? '' : attr.value}
            disabled={isView}
          >
            {attr.formatField.selects.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        );
      }
      case 'text': {
        return (
          <TextField
            fullWidth
            label={attr.name}
            disabled={isView}
            value={attr.value}
            key={attr.name}
          />
        );
      }
      case 'number': {
        return (
          <TextField
            fullWidth
            label={attr.name}
            disabled={isView}
            value={attr.value}
            key={attr.name}
            type="number"
          />
        );
      }
      case 'check': {
        return (
          <FormControlLabel
            control={<Checkbox checked={attr.value === 'true' ? true : false} />}
            label={attr.name}
            key={attr.name}
            disabled={isView}
          />
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>{initialValue.map((e) => renderControl(e))}</Stack>
        </Card>
        <LoadingButton type="submit" fullWidth variant="contained" size="large">
          {t('common.btnUpdate')}
        </LoadingButton>
      </Stack>
    </form>
  );
}
