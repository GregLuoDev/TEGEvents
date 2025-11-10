import { Event } from '@/src/lib/types';
import { EventInput } from '@fullcalendar/core';
import { COLORS } from '../lib/constants';

export function useEventCalendar() {
  function ConvertToEventInputs(events: Event[]): EventInput[] {
    return events
      .map((event) => {
        return {
          id: event.id.toString(),
          title: event.name,
          start: new Date(event.startDate),
          description: event.description,
          venueId: event.venueId,
          backgroundColor: COLORS.Event,
          textColor: COLORS.Text,
          allDay: true,
        } as EventInput;
      })
      .sort((eventA, eventB) => {
        const a = eventA.start;
        const b = eventB.start;
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;
        const dateA = a as Date;
        const dateB = b as Date;
        return dateA.getTime() - dateB.getTime();
      });
  }

  return { ConvertToEventInputs };
}
