// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/core/Autocomplete';
import fetch from 'cross-fetch';
import { Address } from 'models';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { splitWktToLatLng, splitWktTopPostLatLng } from 'utils/common';
import { useDebouncedCallback } from './DebounceHook';

interface SearchAddressProps {
  onChangeAddress?: (address: Address) => void;
}
export function SearchAddress({ onChangeAddress }: SearchAddressProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const searchData = (keySearch) => {
    if (keySearch === '') {
      setOptions([]);
      return;
    }
    let active = true;

    setLoading(true);
    setOptions([]);
    //osm-nominatim-elastic
    (async () => {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || 'https://stg-api.tradezonemap.com/api/v1.0'
        }/address?KeySearch=${keySearch}&IsSearchForBrand=false`
      ); // For demo purposes.
      const countries = await response.json();
      if (active) {
        const ops = Object.keys(countries).map((key) => countries[key] as Address);
        const newOps = [...ops];
        setOptions(newOps);
      }
    })();
    setLoading(false);
    return () => {
      active = false;
    };
  };
  const handelInputChange = useDebouncedCallback((event, newInputValue) => {
    searchData(newInputValue);
  }, 800);

  const handelSelected = (e, value) => {
    if (value === [] || value === undefined || value === null) return;
    if (!onChangeAddress) return;
    const rs = splitWktToLatLng(value.geom);
    const postLatLng = splitWktTopPostLatLng(value.geom);
    value.latlng = rs;
    value.postLatLng = postLatLng;
    onChangeAddress(value);
  };

  return (
    <Autocomplete
      fullWidth
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handelSelected}
      //getOptionSelected={(option, value) => option?.add === value?.name}
      getOptionLabel={(option) => option?.address}
      options={options}
      size="small"
      loading={true}
      noOptionsText={t('common.noOption')}
      onInputChange={handelInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('common.searchAddress')}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}
