import FullCalendar, { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useRef, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import { Card, Button, Container, DialogTitle, useMediaQuery } from '@material-ui/core';

// routes
import { PATH_DASHBOARD } from 'routes/paths';
// hooks
import useSettings from 'hooks/useSettings';
// @types
import { CalendarView } from '../../../@types/calendar';
// components
import Page from 'components/Page';
import { DialogAnimate } from 'components/animate';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { CalendarForm, CalendarStyle, CalendarToolbar } from 'components/dashboard/calendar';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
  selectFilter,
  selectLoading,
  selectTzVersionEvents,
  tzVersionActions
} from '../tzVersionSlice';
import { getCurrentWeek } from 'utils/common';
import { TimeOfDay } from 'models/dto/timeFilter';
import { storeActions } from 'features/store-management/storeSlice';
import { TzVersionRequest } from 'models';

// ----------------------------------------------------------------------

export default function CalendarTradeZoneVersion() {
  const { themeStretch } = useSettings();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef<FullCalendar>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(isMobile ? 'listWeek' : 'timeGridWeek');
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectTzVersionEvents);
  const loading = useAppSelector(selectLoading);
  const language = localStorage.getItem('language');
  const { t } = useTranslation();
  const filter = useAppSelector(selectFilter);

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

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView: CalendarView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    //dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    //dispatch(selectEvent(arg.event.id));
  };

  const handleResizeEvent = async ({ event }: EventResizeDoneArg) => {
    try {
      // dispatch(
      //   updateEvent(event.id, {
      //     allDay: event.allDay,
      //     start: event.start,
      //     end: event.end
      //   })
      // );
      enqueueSnackbar('Update event success', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = async ({ event }: EventDropArg) => {
    try {
      // dispatch(
      //   updateEvent(event.id, {
      //     allDay: event.allDay,
      //     start: event.start,
      //     end: event.end
      //   })
      // );
      enqueueSnackbar('Update event success', {
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    //dispatch(openModal());
  };

  const handleCloseModal = () => {
    //dispatch(closeModal());
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
              startIcon={<Icon icon={plusFill} width={20} height={20} />}
              onClick={handleAddEvent}
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
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
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
              eventResizableFromStart
              select={handleSelectRange}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
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

        {/* <DialogAnimate open={false} onClose={handleCloseModal}>
          <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>

          <CalendarForm
            event={selectedEvent || {}}
            range={selectedRange}
            onCancel={handleCloseModal}
          />
        </DialogAnimate> */}
      </Container>
    </Page>
  );
}
