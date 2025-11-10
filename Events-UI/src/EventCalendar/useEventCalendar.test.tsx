import { COLORS } from '../lib/constants';
import { useEventCalendar } from './useEventCalendar';

describe('useEventCalendar.ConvertToEventInputs', () => {
  const { ConvertToEventInputs } = useEventCalendar();

  test('converts events to EventInput with expected fields', () => {
    const events = [
      {
        id: 1,
        name: 'Event 1',
        description: 'First event',
        startDate: '2025-11-10T00:00:00.000Z',
        venueId: 10,
      },
    ];

    const result = ConvertToEventInputs(events as any);

    expect(result).toHaveLength(1);
    const out = result[0] as any;
    expect(out.id).toBe('1');
    expect(out.title).toBe('Event 1');
    expect(out.start).toBeInstanceOf(Date);
    expect((out.start as Date).toISOString()).toBe(new Date(events[0].startDate).toISOString());
    expect(out.description).toBe('First event');
    expect(out.venueId).toBe(10);
    expect(out.backgroundColor).toBe(COLORS.Event);
    expect(out.textColor).toBe(COLORS.Text);
    expect(out.allDay).toBe(true);
  });

  test('sorts events by start date ascending', () => {
    const events = [
      {
        id: 2,
        name: 'Later',
        description: 'Later event',
        startDate: '2025-12-01T12:00:00.000Z',
        venueId: 20,
      },
      {
        id: 1,
        name: 'Earlier',
        description: 'Earlier event',
        startDate: '2025-10-01T09:00:00.000Z',
        venueId: 10,
      },
    ];

    const result = ConvertToEventInputs(events as any);

    expect(result).toHaveLength(2);
    // After sorting, the earlier event should be first
    expect(result[0].title).toBe('Earlier');
    expect(result[1].title).toBe('Later');
  });

  test('returns empty array for empty input', () => {
    const result = ConvertToEventInputs([] as any);
    expect(result).toEqual([]);
  });
});
