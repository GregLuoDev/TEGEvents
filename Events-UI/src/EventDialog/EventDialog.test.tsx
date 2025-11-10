import { EventInput } from '@fullcalendar/core';
import { fireEvent, render, screen } from '@testing-library/react';
import { EventDialog } from './EventDialog';

// Mock the store selector to return venues
const mockUseAppSelector = jest.fn();
jest.mock('@/src/lib/store', () => ({
  useAppSelector: (fn: any) => mockUseAppSelector(fn),
}));

describe('EventDialog', () => {
  const venues = [
    { id: 1, name: 'Main Hall', capacity: 100, location: '1st Floor' },
    { id: 2, name: 'Room B', capacity: 50, location: '2nd Floor' },
  ];

  beforeEach(() => {
    mockUseAppSelector.mockImplementation((selectorFn: any) => ({ venues }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders selected event title and details including venue', () => {
    const selectedEvent: EventInput = {
      id: '1',
      title: 'Test Event',
      start: new Date('2025-11-10T12:00:00Z'),
      description: 'Details',
      venueId: 1,
    } as any;

    const setSelectedEvent = jest.fn();

    render(<EventDialog selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />);

    // Title
    expect(screen.getByText('Test Event')).toBeInTheDocument();

    // Description
    expect(screen.getByText(/Description:/)).toBeInTheDocument();
    expect(screen.getByText(/Details/)).toBeInTheDocument();

    // Start Date displayed
    expect(screen.getByText(/Start Date:/)).toBeInTheDocument();

    // Venue name and location
    expect(screen.getByText(/Main Hall/)).toBeInTheDocument();
    expect(screen.getByText(/1st Floor/)).toBeInTheDocument();
  });

  test('shows fallback text when description is missing', () => {
    const selectedEvent: EventInput = {
      id: '2',
      title: 'NoDesc',
      start: new Date('2025-11-11T12:00:00Z'),
      // no description
      venueId: 2,
    } as any;

    render(<EventDialog selectedEvent={selectedEvent} setSelectedEvent={jest.fn()} />);

    expect(screen.getByText(/No description/)).toBeInTheDocument();
  });

  test('calls setSelectedEvent(null) when close button clicked', () => {
    const selectedEvent: EventInput = {
      id: '1',
      title: 'CloseMe',
      start: new Date(),
      description: 'x',
      venueId: 1,
    } as any;

    const setSelectedEvent = jest.fn();
    render(<EventDialog selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />);

    const closeBtn = screen.getByLabelText('close');
    fireEvent.click(closeBtn);

    expect(setSelectedEvent).toHaveBeenCalledWith(null);
  });
});
