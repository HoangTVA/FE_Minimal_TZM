import { Autocomplete, TextField } from '@material-ui/core';
import { Control, useController } from 'react-hook-form';

export interface SelectOptions {
  name?: string;
  id: number | string;
}
interface SelectFieldProps {
  name: string;
  control: Control<any>;
  size?: 'medium' | 'small';
  label?: string;
  disabled?: boolean;
  options: SelectOptions[];
}

export default function AutoCompleteField({
  name,
  control,
  label,
  disabled,
  options
}: SelectFieldProps) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid, error }
  } = useController({
    name,
    control
  });
  return (
    <Autocomplete
      fullWidth
      multiple
      disabled={disabled}
      //defaultValue={timeSelectedList}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField {...params} label={label} error={invalid} helperText={error?.message} />
      )}
    />
  );
}
