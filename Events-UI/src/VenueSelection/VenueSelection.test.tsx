/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { VenueSelection } from './VenueSelection';

describe('VenueSelection', () => {
  const mockVenues = [
    { id: 121, name: 'The Coding Theatre', capacity: 450, location: 'TEG Metaverse' },
    { id: 123, name: 'TEG Stadium', capacity: 65000, location: 'London, UK' },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dropdown with all venue options', () => {
    render(<VenueSelection venues={mockVenues as any} onChange={mockOnChange} />);

    // Label and select should exist
    expect(screen.getByLabelText('Select Venue')).toBeInTheDocument();

    // Click to open dropdown
    fireEvent.mouseDown(screen.getByLabelText('Select Venue'));

    // Ensure both venues appear
    expect(screen.getByText(/The Coding Theatre/)).toBeInTheDocument();
    expect(screen.getByText(/TEG Stadium/)).toBeInTheDocument();
  });

  test('calls onChange with correct venue when user selects one', () => {
    render(<VenueSelection venues={mockVenues as any} onChange={mockOnChange} />);

    const select = screen.getByLabelText('Select Venue');

    // Open dropdown
    fireEvent.mouseDown(select);

    // Select "TEG Stadium"
    const stadiumOption = screen.getByText(/TEG Stadium/);
    fireEvent.click(stadiumOption);

    // Expect onChange called with matching venue
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockVenues[1]);
  });

  test('handles empty venue list gracefully', () => {
    render(<VenueSelection venues={[]} onChange={mockOnChange} />);

    // Should render select but no menu items
    expect(screen.getByLabelText('Select Venue')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText('Select Venue'));

    // No items should be available
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  test('does not crash if onChange is not provided', () => {
    render(<VenueSelection venues={mockVenues as any} onChange={undefined as any} />);

    const select = screen.getByLabelText('Select Venue');
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText(/TEG Stadium/));

    // Should not throw error
    expect(screen.getByText('Venue')).toBeInTheDocument();
  });
});
