import { Box, Card, Grid, Stack, Typography } from '@material-ui/core';
import { MapDraggable, SearchAddress } from 'components/common';
import InputField from 'components/FormField/InputField';
import { IcMarkerLocation } from 'components/map/MarkerStyles';
import { LatLngExpression } from 'leaflet';
import { Address, NominatimAddress } from 'models';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getAddressDataByLatLngUtils } from 'utils/common';
export const FormLocationForm = ({ formContent }) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const [location, setLocation] = useState<LatLngExpression>();
  const { control, setValue } = methods;
  useEffect(() => {
    if (!location) return;
    setValue('fromStation.latitude', location[0].toString(), {
      shouldDirty: true
    });
    setValue('fromStation.longitude', location[1].toString(), {
      shouldDirty: true
    });
    getAddressDataByLatLng(location[0], location[1]);
  }, [location]);
  const getAddressDataByLatLng = async (lat: number, lng: number) => {
    const data: NominatimAddress = await getAddressDataByLatLngUtils(lat, lng);
    setValue('fromStation.address', data.display_name || '', {
      shouldDirty: true
    });
    setValue('fromStation.district', data.address.town || data.address.county || '', {
      shouldDirty: true
    });
    setValue(
      'fromStation.ward',
      data.address.quarter || data.address.suburb || data.address.village || '',
      {
        shouldDirty: true
      }
    );
    setValue('fromStation.city', data.address.city || data.address.state || '', {
      shouldDirty: true
    });
    //console.log(data);
  };
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
  };
  const handelOnDragMarker = (point: any) => {
    // setLocationSelected(point['lng'].toString() + ' ' + point['lat'].toString());
    const latLng: LatLngExpression = [point.lat, point.lng];
    setLocation(latLng);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={4}>
            {t('order.startInfo')}
          </Typography>
          <Stack spacing={3}>
            <InputField
              name="fromStation.latitude"
              label={t('common.lat') + '*'}
              control={control}
              disabled={true}
            />
            <InputField
              name="fromStation.longitude"
              label={t('common.lng') + '*'}
              control={control}
              disabled={true}
            />
            <InputField
              name="fromStation.address"
              label={t('store.address') + '*'}
              control={control}
            />
            <InputField
              name="fromStation.city"
              label={t('adminLevel.province') + '*'}
              control={control}
            />
            <InputField
              name="fromStation.district"
              label={t('adminLevel.district') + '*'}
              control={control}
            />
            <InputField
              name="fromStation.ward"
              label={t('adminLevel.ward') + '*'}
              control={control}
            />
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom marginBottom={3}>
            {t('order.latLng')}
          </Typography>
          <Stack spacing={3}>
            <Box>
              <SearchAddress onChangeAddress={handelSelectLocation} />
              <Box mt={3}>
                <MapDraggable
                  location={location}
                  onDraggable={handelOnDragMarker}
                  icon={IcMarkerLocation}
                />
              </Box>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};
