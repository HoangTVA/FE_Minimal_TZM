// material
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography
} from '@material-ui/core';
import Pagination from '@material-ui/core/Pagination';
import { styled } from '@material-ui/core/styles';
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
// hooks
import useSettings from 'hooks/useSettings';
import { PostTemplate, Store, Template } from 'models';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import { splitLongString } from 'utils/common';
import ShopProductList from '../components/ShopProductList';
import TemplateForm from '../components/TemplateForm';
import { selectFilterTemplate, selectLoading, selectTemplate, storeActions } from '../storeSlice';
// ----------------------------------------------------------------------
const ProductImgStyle = styled('img')(({ theme }) => ({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
}));
export default function StoreTemplatePage() {
  const { themeStretch } = useSettings();
  const { storeId } = useParams();
  const [store, setStore] = useState<Store>();
  const [templateForm, setTemplateForm] = useState<PostTemplate>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilterTemplate);
  const rs = useAppSelector(selectTemplate);
  const loading = useAppSelector(selectLoading);
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState<Template>();
  const [selectTemplateId, setSelectTemplateId] = useState<Template>();
  const { enqueueSnackbar } = useSnackbar();

  //effect
  useEffect(() => {
    if (!storeId) return;

    //IFFE
    (async () => {
      try {
        const data: Store = await storeApi.getStoreById(storeId);

        const newValue: PostTemplate = {
          url: data?.url || '',
          templateId: data?.template.id || 0
        };
        setStore(data);
        setTemplateForm(newValue);
        setSelectTemplateId(data?.template);
      } catch (error) {}
    })();
  }, [storeId]);
  useEffect(() => {
    dispatch(storeActions.fetchStoreTemplates(filter));
  }, [dispatch, filter]);
  const initialValues: PostTemplate = {
    url: '',
    templateId: 0,
    ...templateForm
  } as PostTemplate;
  const handelStoreFormSubmit = async (formValues: PostTemplate) => {
    try {
      await storeApi.updateStoreTemplate(storeId, formValues);
      enqueueSnackbar(
        t('store.updateSuccessStart') + store?.name + ' ' + t('store.updateSuccessEnd'),
        { variant: 'success' }
      );
      navigate(`${PATH_DASHBOARD.store.details}/${storeId}`);
    } catch (error) {
      enqueueSnackbar(
        store?.name + ' ' + t('common.errorText') + ' ,' + t('store.storeCodeIsExisted'),
        { variant: 'error' }
      );
    }
  };

  //header
  const { t } = useTranslation();

  const handelViewClick = (template: Template) => {
    setSelected(template);
    setPopup(true);
  };
  const handelSelectClick = (template: Template) => {
    setSelectTemplateId(template);
    enqueueSnackbar(t('store.selected') + template?.name, {
      variant: 'success'
    });
  };
  const handelPagingNumberChange = (e: any, page: number) => {
    dispatch(
      storeActions.setFilterTemplate({
        ...filter,
        page: page
      })
    );
  };
  return (
    <Page title={t('store.editTemplate')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('store.listStore')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('store.title'), href: PATH_DASHBOARD.store.root },
            {
              name: splitLongString(store?.name || ''),
              href: `${PATH_DASHBOARD.store.details}/${storeId}`
            },
            { name: t('store.editTemplate') }
          ]}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={7}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom marginBottom={4}>
                {t('content.listTemplate')}
              </Typography>
              <ShopProductList
                products={rs.results}
                isLoad={loading}
                onSelectTemplate={handelSelectClick}
                onViewTemplate={handelViewClick}
                selected={selectTemplateId}
              />
              <Box mt={2}>
                <Pagination
                  color="standard"
                  count={rs.totalNumberOfPages}
                  page={rs.pageNumber}
                  showFirstButton
                  showLastButton
                  onChange={handelPagingNumberChange}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            {(Boolean(storeId) || Boolean(templateForm)) && (
              <TemplateForm
                initialValue={initialValues}
                onSubmit={handelStoreFormSubmit}
                storeName={store?.name || ''}
                selectedTemplateName={store?.template.name || ''}
                selectTemplate={selectTemplateId || undefined}
              />
            )}
          </Grid>
        </Grid>
      </Container>
      <Dialog open={popup} onClose={() => setPopup(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{selected?.name}</DialogTitle>
        <DialogContent style={{ marginTop: '15px' }}>
          <DialogContentText>
            <Card>
              <Box sx={{ pt: '100%', position: 'relative' }}>
                <ProductImgStyle alt={'error'} src={selected?.imageUrl} />
              </Box>
            </Card>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPopup(false)}>
            {t('content.btnClose')}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
