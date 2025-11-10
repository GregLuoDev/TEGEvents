import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { EventInput } from '@fullcalendar/core';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '@/src/lib/store';

type Props = {
  selectedEvent: EventInput;
  setSelectedEvent: Dispatch<SetStateAction<EventInput | null>>;
};

export function EventDialog({ selectedEvent, setSelectedEvent }: Props) {
  const { venues } = useAppSelector((state) => state.event);
  const venue = venues.find((venue) => venue.id === selectedEvent.venueId);

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
        <strong>Venue:</strong>
        <span>
          {venue!.name} at <i>{venue!.location}</i>
        </span>
      </DialogContent>
    </Dialog>
  );
}
