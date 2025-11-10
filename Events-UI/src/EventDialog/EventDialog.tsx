import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Event } from '@/src/lib/types';
import { Dispatch, SetStateAction } from 'react';
import { EventInput, CalendarApi } from '@fullcalendar/core';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  selectedEvent: EventInput;
  setSelectedEvent: Dispatch<SetStateAction<EventInput | null>>;
};

export function EventDialog({ selectedEvent, setSelectedEvent }: Props) {
  return (
    <Dialog open={!!selectedEvent}>
      <DialogTitle>{selectedEvent?.title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setSelectedEvent(null)}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <strong>Description:</strong> {selectedEvent?.description || 'No description'}
        <br />
        <strong>Start Date:</strong>
        {selectedEvent.start ? selectedEvent.start.toLocaleString() : ''}
        <br />
        <strong>Venue ID:</strong> {selectedEvent?.venueId}
      </DialogContent>
    </Dialog>
  );
}
