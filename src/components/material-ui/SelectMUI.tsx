import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface SelectMUIProps {
  label: string;
  labelId: string;

  selected?: any;
  isAll: boolean;
  options: any[];
  onChange?: (id: number) => void;
}

export default function SelectMUI({
  selected,
  isAll,
  options,
  onChange,
  label,
  labelId
}: SelectMUIProps) {
  const { t } = useTranslation();
  const handelChangeEvent = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    if (!onChange) return;
    const selectedId = e.target.value ? Number(e.target.value) : 0;
    onChange(selectedId);
  };
  return (
    <FormControl variant="outlined" size="medium" fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select labelId={labelId} value={selected || ''} onChange={handelChangeEvent} label={label}>
        {isAll && (
          <MenuItem value="">
            <em>{t('common.all')}</em>
          </MenuItem>
        )}

        {options.map((e) => (
          <MenuItem key={e.id} value={e.id}>
            {e.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
