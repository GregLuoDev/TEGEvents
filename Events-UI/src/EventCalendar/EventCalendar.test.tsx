/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { EventCalendar } from './EventCalendar';

// Mock the conversion hook
const mockConvertToEventInputs = jest.fn();
jest.mock('./useEventCalendar', () => ({
  useEventCalendar: () => ({ ConvertToEventInputs: mockConvertToEventInputs }),
}));

// Mock EventDialog to a simple element when shown (avoid JSX in factory)
jest.mock('../EventDialog/EventDialog', () => {
  const React = require('react');
  return {
    EventDialog: ({ selectedEvent }: any) =>
      selectedEvent
        ? React.createElement('div', { 'data-testid': 'event-dialog' }, selectedEvent.title)
        : null,
  };
});

// Mock FullCalendar: render a div that calls eventClick when clicked (avoid JSX)
jest.mock('@fullcalendar/react', () => (props: any) => {
  const React = require('react');
  return React.createElement(
    'div',
    {
      'data-testid': 'fullcalendar',
      onClick: () => props.eventClick?.({ event: { id: props.events?.[0]?.id } }),
    },
    'FullCalendarMock',
  );
});

// Mock FullCalendar plugin modules which may ship ESM and break Jest parsing
jest.mock('@fullcalendar/daygrid', () => ({}));
jest.mock('@fullcalendar/timegrid', () => ({}));
jest.mock('@fullcalendar/interaction', () => ({}));

describe('EventCalendar (simple tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConvertToEventInputs.mockReturnValue([]);
  });

  test('renders FullCalendar and calls ConvertToEventInputs with events', () => {
    const events = [{ id: 1, name: 'A', description: '', startDate: '2025-11-10', venueId: 1 }];
    render(<EventCalendar events={events as any} />);

    expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
    expect(mockConvertToEventInputs).toHaveBeenCalledWith(events);
  });

  test('shows EventDialog after clicking an event', () => {
    mockConvertToEventInputs.mockReturnValue([{ id: '1', title: 'Event 1', start: new Date() }]);
    const events = [
      { id: 1, name: 'Event 1', description: '', startDate: '2025-11-10', venueId: 1 },
    ];

    render(<EventCalendar events={events as any} />);

    fireEvent.click(screen.getByTestId('fullcalendar'));

    expect(screen.getByTestId('event-dialog')).toHaveTextContent('Event 1');
  });

  test('handles empty events without throwing', () => {
    render(<EventCalendar events={[]} />);
    expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
    expect(mockConvertToEventInputs).toHaveBeenCalledWith([]);
  });
});
