import { FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { size } from 'lodash';
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

export default function SelectField({ name, control, label, disabled, options }: SelectFieldProps) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid, error }
  } = useController({
    name,
    control
  });
  return (
    <FormControl
      variant="outlined"
      fullWidth
      disabled={disabled}
      margin="normal"
      component="fieldset"
      error={invalid}
      size={size === undefined ? 'small' : 'medium'}
    >
      <InputLabel id={`${name}_label`}>{label}</InputLabel>

      <Select
        labelId={`${name}_label`}
        onChange={onChange}
        onBlur={onBlur}
        label={label}
        value={value === 0 ? '' : value}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>{error?.message}</FormHelperText>
    </FormControl>
  );
}
