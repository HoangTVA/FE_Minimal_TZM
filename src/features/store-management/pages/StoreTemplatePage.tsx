import eyeFill from '@iconify/icons-eva/eye-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import arrowCircleRightFill from '@iconify/icons-eva/arrow-circle-right-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Card,
  Container,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
// material
import { Box } from '@material-ui/system';
import storeApi from 'api/storeApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useTable } from 'components/common';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// @types
// components
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
// hooks
import useSettings from 'hooks/useSettings';
import { PaginationRequest, PostTemplate, Store } from 'models';
import { useSnackbar } from 'notistack5';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// redux
// routes
import { PATH_DASHBOARD } from 'routes/paths';
import StoreFilter from '../components/StoreFilter';
import TemplateForm from '../components/TemplateForm';
import { selectFilterTemplate, selectLoading, selectTemplate, storeActions } from '../storeSlice';
// ----------------------------------------------------------------------
const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
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
    } catch (error) {
      enqueueSnackbar(
        store?.name + ' ' + t('common.errorText') + ' ,' + t('store.storeCodeIsExisted'),
        { variant: 'error' }
      );
    }
  };
  const onPageChange = (page: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        page: page + 1
      })
    );
  };
  const onRowPerPageChange = (perPage: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        pageSize: perPage
      })
    );
  };
  const onSortChange = (colName: string, sortType: number) => {
    dispatch(
      storeActions.setFilter({
        ...filter,
        colName: colName,
        sortType: sortType
      })
    );
  };
  const handelSearchDebounce = (newFilter: PaginationRequest) => {
    dispatch(storeActions.setFilterWithDebounce(newFilter));
  };

  //header
  const { t } = useTranslation();
  const headCells = [
    { id: 'id', label: t('store.templateId') },
    { id: 'imageUrl', label: t('store.imageUrl') },
    { id: 'name', label: t('store.templateName') },
    { id: 'actions', label: t('common.actions'), disableSorting: true, align: 'center' }
  ];

  const { TblHead, TblPagination } = useTable({
    rs,
    headCells,
    filter,
    onPageChange,
    onRowPerPageChange,
    onSortChange
  });
  const handelDetailsClick = (store: Store) => {
    navigate(`${PATH_DASHBOARD.store.details}/${store.id}`);
  };
  return (
    <Page title={t('store.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('store.listStore')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('store.title'), href: PATH_DASHBOARD.store.root },
            { name: t('store.listStore') }
          ]}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={7}>
            <Card>
              <StoreFilter filter={filter} onSearchChange={handelSearchDebounce} />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TblHead />
                    <TableBody>
                      {true && (
                        <TableRow style={{ height: 1 }}>
                          <TableCell
                            colSpan={20}
                            style={{ paddingBottom: '0px', paddingTop: '0px' }}
                          >
                            <Box>{loading && <LinearProgress color="primary" />}</Box>
                          </TableCell>
                        </TableRow>
                      )}

                      {rs.results.map((e, idx) => (
                        <TableRow key={e.id}>
                          <TableCell width={80} component="th" scope="row" padding="none">
                            {idx + 1}
                          </TableCell>
                          <TableCell align="left">
                            <Box
                              sx={{
                                py: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <ThumbImgStyle alt={'error'} src={e.imageUrl} />
                            </Box>
                          </TableCell>
                          <TableCell align="left">{e.name}</TableCell>
                          <TableCell width={250}>
                            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                              <Button
                                color="info"
                                onClick={() => {}}
                                startIcon={<Icon icon={arrowCircleRightFill} color="#1890FF" />}
                              >
                                {t('common.select')}
                              </Button>
                              <Button
                                color="info"
                                onClick={() => {}}
                                startIcon={<Icon icon={eyeFill} color="#1890FF" />}
                              >
                                {t('common.view')}
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                      {rs.results.length === 0 && (
                        <TableRow style={{ height: 53 * 10 }}>
                          <TableCell colSpan={20}>
                            <Typography gutterBottom align="center" variant="subtitle1">
                              {t('common.notFound')}
                            </Typography>
                            <Typography variant="body2" align="center">
                              {t('common.searchNotFound')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TblPagination />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            {Boolean(templateForm) && (
              <TemplateForm
                initialValue={initialValues}
                onSubmit={handelStoreFormSubmit}
                storeName={store?.name || ''}
              />
            )}
          </Grid>
        </Grid>
      </Container>
      {/* <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('common.titleConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('store.removeTitleStart') + storeSelected?.name + ' ' + t('store.removeTitleEnd')}
            <br />
            {t('common.canRevert')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setConfirmDelete(false)}>
            {t('content.btnClose')}
          </Button>
          <Button onClick={handelConfirmRemoveClick} autoFocus>
            {t('common.confirmBtn')}
          </Button>
        </DialogActions>
      </Dialog> */}
    </Page>
  );
}
