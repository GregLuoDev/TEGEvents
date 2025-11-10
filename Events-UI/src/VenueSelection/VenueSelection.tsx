import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography, Box } from '@mui/material';
import { Venue } from '../lib/types';

type Props = {
  venues: Venue[];
  onChange: any;
};
export function VenueSelection({ venues, onChange }: Props) {
  const [selectedVenue, setSelectedVenue] = useState('');

  const handleChange = (event: any) => {
    const venueId = event.target.value;
    setSelectedVenue(venueId);
    if (onChange) {
      const venue = venues.find((v) => v.id === venueId);
      onChange(venue);
    }
  };

  return (
    <Box sx={{ minWidth: 300, pt: 2, pb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Select Venue
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="venue-select-label">Venue</InputLabel>
        <Select
          labelId="venue-select-label"
          value={selectedVenue}
          label="Venue"
          onChange={handleChange}
        >
          {venues.map((venue) => (
            <MenuItem key={venue.id} value={venue.id}>
              <div>
                <b>{venue.name}</b> at <i>{venue.location}</i>, with capacity {venue.capacity}
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
