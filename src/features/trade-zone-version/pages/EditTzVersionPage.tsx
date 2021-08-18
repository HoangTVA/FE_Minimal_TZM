import { Box, Container, Grid } from '@material-ui/core';
import tzVersionApi from 'api/tradeZoneVersionApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import useSettings from 'hooks/useSettings';
import { PutTzVersion, TzVersion } from 'models';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getCurrentUser } from 'utils/common';
import TzVersionViewEditForm from '../components/TzVersionViewEditForm';
import { selectFilter, tzVersionActions } from '../tzVersionSlice';

export default function EditTzVersionPage() {
  const { tzVersionId } = useParams();
  const isEdit = Boolean(tzVersionId);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const [tzVersion, setTzVersion] = useState<TzVersion>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filter = useAppSelector(selectFilter);
  const user = getCurrentUser();
  useEffect(() => {
    if (!tzVersionId) return;

    //IFFE
    (async () => {
      try {
        const data: TzVersion = await tzVersionApi.getById(tzVersionId);
        setTzVersion(data);
      } catch (error) {}
    })();
  }, [tzVersionId]);
  const handelStoreFormSubmit = async (formValues: TzVersion) => {
    if (!isEdit) {
      try {
        if (!user) return;
        const valueUpdate = {
          name: formValues.name,
          dateFilter: formValues.dateFilter,
          timeSlot: formValues.timeSlot,
          description: formValues.description,
          brandId: user.brandId,
          groupZoneId: formValues.groupZoneId
        } as PutTzVersion;
        await tzVersionApi.add(valueUpdate);
        enqueueSnackbar(formValues?.name + ' ' + t('asset.addSuccess'), { variant: 'success' });
        const newFilter = { ...filter };
        dispatch(tzVersionActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.tradeZone.tradeZoneVersion);
      } catch (error) {
        enqueueSnackbar(formValues?.name + ' ' + t('common.errorText'), { variant: 'error' });
      }
    } else {
      try {
        const valueUpdate = {
          name: formValues.name,
          dateFilter: formValues.dateFilter,
          timeSlot: formValues.timeSlot,
          description: formValues.description
        } as PutTzVersion;
        await tzVersionApi.update(tzVersionId, valueUpdate);
        enqueueSnackbar(
          t('asset.updateSuccessStart') + formValues.name + ' ' + t('asset.updateSuccessEnd'),
          { variant: 'success' }
        );
        const newFilter = { ...filter };
        dispatch(tzVersionActions.setFilter(newFilter));
        navigate(PATH_DASHBOARD.tradeZone.tradeZoneVersion);
      } catch (error) {
        enqueueSnackbar(formValues?.name + ' ' + t('common.errorText'), { variant: 'error' });
      }
    }
  };
  const initialValues: TzVersion = {
    name: '',
    dateFilter: '0000000',
    timeSlot: '000000000000000000000000',
    description: '',
    groupZoneId: 0,
    ...tzVersion
  } as TzVersion;
  return (
    <Page title={isEdit ? t('tz.editTitle') : t('tz.addTitle')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={isEdit ? t('tz.editTitle') : t('tz.addTitle')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('tz.tzList'), href: PATH_DASHBOARD.tradeZone.tradeZoneVersion },
            {
              name: isEdit ? tzVersion?.name || '' : t('tz.addTitle')
            }
          ]}
        />
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              {(!isEdit || Boolean(tzVersion)) && (
                <TzVersionViewEditForm
                  initialValue={initialValues}
                  onSubmit={handelStoreFormSubmit}
                  isView={false}
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
