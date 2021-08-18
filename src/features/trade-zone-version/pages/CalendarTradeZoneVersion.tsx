import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Card,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery
} from '@material-ui/core';
// material
import { useTheme } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { DialogAnimate } from 'components/animate';
import { CalendarStyle, CalendarToolbar } from 'components/dashboard/calendar';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
// components
import Page from 'components/Page';
import { storeActions } from 'features/store-management/storeSlice';
// hooks
import useSettings from 'hooks/useSettings';
import { TzVersionRequest } from 'models';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// @types
import { CalendarView } from '../../../@types/calendar';
import {
  selectedEventSelector,
  selectedOpenModal,
  selectFilter,
  selectTzVersionEvents,
  tzVersionActions
} from '../tzVersionSlice';

// ----------------------------------------------------------------------

export default function CalendarTradeZoneVersion() {
  const { themeStretch } = useSettings();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef<FullCalendar>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(isMobile ? 'listWeek' : 'timeGridWeek');
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectTzVersionEvents);
  const language = localStorage.getItem('language');
  const { t } = useTranslation();
  const filter = useAppSelector(selectFilter);
  const selectedEvent = useAppSelector(selectedEventSelector);
  const isOpenModal = useAppSelector(selectedOpenModal);

  useEffect(() => {
    dispatch(storeActions.fetchStores({}));
  }, [dispatch]);
  useEffect(() => {
    dispatch(
      tzVersionActions.fetchTzVersionList({
        ...filter,
        groupZoneId: 0
      })
    );
  }, [dispatch, filter]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isMobile ? 'listWeek' : 'timeGridWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isMobile]);

  const handleChangeView = (newView: CalendarView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    dispatch(tzVersionActions.selectEvent(arg.event.id));
  };

  const handleCloseModal = () => {
    dispatch(tzVersionActions.closeModal());
  };
  const handelFilterChange = (newFilter: TzVersionRequest) => {
    dispatch(tzVersionActions.setFilterWithDebounce(newFilter));
  };

  return (
    <Page title={t('tz.calendar')}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={t('tz.calendar')}
          links={[
            { name: t('content.dashboard'), href: PATH_DASHBOARD.root },

            { name: t('tz.calendar') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.tradeZone.add}
              startIcon={<Icon icon={plusFill} width={20} height={20} />}
            >
              {t('tz.add')}
            </Button>
          }
        />

        <Card>
          <CalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onChangeView={handleChangeView}
              onChange={handelFilterChange}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              events={events}
              ref={calendarRef}
              rerenderDelay={10}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              eventClick={handleSelectEvent}
              eventResizableFromStart
              height={isMobile ? 'auto' : 720}
              allDaySlot={false}
              firstDay={1}
              locale={language || 'vi'}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin
              ]}
            />
          </CalendarStyle>
        </Card>

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{t('tz.info')}</DialogTitle>

          <DialogContent sx={{ pb: 0, overflowY: 'unset' }}>
            <Box mt={2}></Box>
            <TextField
              fullWidth
              label={'#Id'}
              sx={{ mb: 3 }}
              value={selectedEvent?.id || ''}
              disabled
            />
            <TextField
              fullWidth
              label={t('tz.tzVerName')}
              sx={{ mb: 3 }}
              value={selectedEvent?.title || ''}
              disabled
            />
            <TextField
              fullWidth
              label={t('common.description')}
              sx={{ mb: 3 }}
              value={selectedEvent?.description || ''}
              disabled
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="outlined" color="inherit" onClick={handleCloseModal}>
              {t('content.btnClose')}
            </Button>
            {/* <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              loadingIndicator="Loading..."
            >
              Add
            </LoadingButton> */}
          </DialogActions>
        </DialogAnimate>
      </Container>
    </Page>
  );
}
