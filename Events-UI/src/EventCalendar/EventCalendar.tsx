'use client';
import { Event } from '@/src/lib/types';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useEventCalendar } from './useEventCalendar';
import { EventDialog } from '../EventDialog/EventDialog';

export function EventCalendar({ events }: { events: Event[] }) {
  const { ConvertToEventInputs } = useEventCalendar();
  const eventInputs: EventInput[] = ConvertToEventInputs(events);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (events.length) {
      const lastDate = events[events.length - 1].startDate;
      if (!lastDate) return;

      const calendarApi = calendarRef.current?.getApi();
      calendarApi?.gotoDate(lastDate);
    }
  }, [events]);

  return (
    <Box>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventInputs}
        height="calc(100vh - 190px)"
        eventClick={(info) => {
          const event = eventInputs.find((e) => e.id === info.event.id);
          if (event) setSelectedEvent(event);
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
      />

      {selectedEvent && (
        <EventDialog selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
      )}
    </Box>
  );
}
