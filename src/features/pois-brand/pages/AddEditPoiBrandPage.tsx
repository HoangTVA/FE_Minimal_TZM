import { Box, Card, Container, Grid, Stack, TextField, Autocomplete } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { SearchAddress } from 'components/common';
import MapWithMarker from 'components/common/MapWithMarker';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Address, Poi, PoiPagingRequest, PostPoiBrand } from 'models';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser, splitWktToLatLng } from 'utils/common';
import { useSnackbar } from 'notistack5';
import { poiBrandActions, selectFilter } from 'features/pois-brand/poiBrandSlice';
import { poiActions, selectFilter as selectFilterPoi, selectPoiList } from 'features/pois/poiSlice';
import PoiBrandForm from '../components/PoiBrandForm';
import './style.css';
import poiApi from 'api/poiApi';
import {
  adminLevelActions,
  selectDistrictOptions,
  selectProvinceOptions,
  selectWardOptions
} from 'features/admin-level/adminLevelSlice';
import SelectMUI from 'components/material-ui/SelectMUI';

interface AddEditPoiBrandPageProps {}
const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 300,
  height: 300,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));
export default function AddEditPoiBrandPage(props: AddEditPoiBrandPageProps) {
  const { poiId } = useParams();
  const isEdit = Boolean(poiId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [poi, setPoi] = useState<PostPoiBrand>();
  const [location, setLocation] = useState<LatLngExpression>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const filterPoi = useAppSelector(selectFilterPoi);
  const user = getCurrentUser();
  const provinceOptions = useAppSelector(selectProvinceOptions);
  const districtOptions = useAppSelector(selectDistrictOptions);
  const wardOptions = useAppSelector(selectWardOptions);
  const poiList = useAppSelector(selectPoiList);
  useEffect(() => {
    dispatch(poiActions.fetchPoiList(filterPoi));
  }, [dispatch, filterPoi]);
  useEffect(() => {
    if (!poiId) return;

    //IFFE
    (async () => {
      try {
        const data: Poi = await poiApi.getPoiBrandById(poiId);

        if (data?.geom) {
          const latLng = splitWktToLatLng(data.geom);
          setLocation(latLng);
        }
        const newValue: PostPoiBrand = {
          alias: data.alias,
          brandId: data.brandId,
          brandPoiCode: data.brandPoiCode,
          createBy: data.createBy,
          notes: data.notes,
          poiId: data.id
        };
        setPoi(newValue);
      } catch (error) {}
    })();
  }, [poiId]);
  const handelStoreFormSubmit = async (formValues: PostPoiBrand) => {
    // if (!isEdit) {
    //   try {
    //     if (!user) return;
    //     await storeApi.add(formValues);
    //     enqueueSnackbar(formValues?.name + ' ' + t('store.addSuccess'), { variant: 'success' });
    //     const newFilter = { ...filter };
    //     dispatch(poiBrandActions.setFilter(newFilter));
    //     navigate(PATH_DASHBOARD.store.root);
    //   } catch (error) {
    //     enqueueSnackbar(
    //       formValues?.name + ' ' + t('common.errorText') + ' ,' + t('store.storeCodeIsExisted'),
    //       { variant: 'error' }
    //     );
    //   }
    // } else {
    //   try {
    //     if (!user) return;
    //     await storeApi.update(Number(poiId), formValues);
    //     enqueueSnackbar(
    //       t('store.updateSuccessStart') + formValues.name + ' ' + t('store.updateSuccessEnd'),
    //       { variant: 'success' }
    //     );
    //     const newFilter = { ...filter };
    //     dispatch(poiBrandActions.setFilter(newFilter));
    //     navigate(PATH_DASHBOARD.store.root);
    //   } catch (error) {
    //     enqueueSnackbar(
    //       formValues?.name + ' ' + t('common.errorText') + ' ,' + t('store.storeCodeIsExisted'),
    //       { variant: 'error' }
    //     );
    //   }
    // }
  };
  const initialValues: PostPoiBrand = {
    brandId: user?.brandId,
    poiId: 0,
    alias: '',
    brandPoiCode: '',
    createBy: user?.id,
    notes: '',
    ...poi
  } as PostPoiBrand;
  const handelSelectLocation = (address: Address) => {
    setLocation(address?.latlng);
  };
  const handleProvinceChange = (selectedId: number) => {
    dispatch(adminLevelActions.provinceChange(selectedId));
    const newFilter: PoiPagingRequest = {
      ...filterPoi,
      provinceId: selectedId,
      page: 1,
      pageSize: 200
    };
    dispatch(poiActions.setFilterWithDebounce(newFilter));
  };
  const handleDistrictChange = (selectedId: number) => {
    dispatch(adminLevelActions.districtChange(selectedId));
    const newFilter: PoiPagingRequest = {
      ...filterPoi,
      districtId: selectedId,
      page: 1,
      pageSize: 200
    };
    dispatch(poiActions.setFilterWithDebounce(newFilter));
  };
  const handelWardChange = (selectedId: number) => {
    const newFilter: PoiPagingRequest = {
      ...filterPoi,
      wardId: selectedId,
      page: 1,
      pageSize: 200
    };
    dispatch(poiActions.setFilterWithDebounce(newFilter));
  };
  return (
    <Page title={isEdit ? t('poi.editPoiBrandTitle') : t('poi.addPoiBrandTitle')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('poi.editPoiBrandTitle') : t('poi.addPoiBrandTitle')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('poi.poiBrand'), href: PATH_DASHBOARD.poiBrand.root },
            { name: isEdit ? t('poi.editPoiBrandTitle') : t('poi.addPoiBrandTitle') }
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <Box
                      style={{
                        display: 'flex',
                        flexFlow: 'row nowrap',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <SelectMUI
                        isAll={true}
                        label={t('adminLevel.province')}
                        labelId="filterByProvince"
                        options={provinceOptions}
                        onChange={handleProvinceChange}
                        selected={filterPoi.provinceId}
                      />
                      <SelectMUI
                        isAll={true}
                        label={t('adminLevel.district')}
                        labelId="filterByDistrict"
                        options={districtOptions}
                        onChange={handleDistrictChange}
                        selected={filterPoi.districtId}
                      />
                      <SelectMUI
                        isAll={true}
                        label={t('adminLevel.ward')}
                        labelId="filterByWard"
                        onChange={handelWardChange}
                        selected={filterPoi.wardId}
                        options={wardOptions}
                      />
                    </Box>
                    <Box>
                      <Autocomplete
                        id="combo-box-demo"
                        options={poiList.results}
                        getOptionLabel={(option) => option.name}
                        fullWidth
                        renderInput={(params) => (
                          <TextField {...params} label="Combo box" variant="outlined" />
                        )}
                      />
                    </Box>
                    <Box mt={3}>
                      <MapWithMarker position={location} />
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              {(!isEdit || Boolean(poi)) && (
                <PoiBrandForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isEdit={isEdit}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
