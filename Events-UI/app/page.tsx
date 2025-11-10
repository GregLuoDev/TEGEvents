'use client';

import { EventCalendar } from '@/src/EventCalendar/EventCalendar';
import { useAppDispatch, useAppSelector } from '@/src/lib/store';
import { fetchEvents, fetchVenues } from '@/src/lib/thunks/eventAsyncThunks';
import { Venue } from '@/src/lib/types';
import { VenueSelection } from '@/src/VenueSelection/VenueSelection';
import { Alert, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Home() {
  const [selectedVenueId, setSelectedVenueId] = useState<undefined | number>();
  const dispatch = useAppDispatch();
  const {
    events,
    venues,
    isLoadingEvents,
    fetchingEventsError,
    isLoadingVenues,
    fetchingVenuesError,
  } = useAppSelector((state) => state.event);
  const filteredEvents = events.filter(
    (event) => !selectedVenueId || event.venueId === selectedVenueId,
  );

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchVenues());
  }, [dispatch]);

  function handleChangeVenue(venue: Venue) {
    setSelectedVenueId(venue.id);
  }

  const isLoading =
    (isLoadingEvents && !fetchingEventsError) || (isLoadingVenues && !fetchingVenuesError);

  const hasErrors =
    (!isLoadingEvents && !!fetchingEventsError) || (!isLoadingVenues && !!fetchingVenuesError);

  const shouldShowData =
    (!isLoadingEvents && !fetchingEventsError) || (!isLoadingVenues && !fetchingVenuesError);

  return (
    <div className="container mx-auto p-8">
      <Typography variant="h5" gutterBottom>
        What's on at TEG Staduim!
      </Typography>

      {isLoading && <CircularProgress />}
      {hasErrors && <Alert severity="error">Cannot fetch data. Please try again.</Alert>}
      {shouldShowData && (
        <>
          <VenueSelection venues={venues} onChange={handleChangeVenue} />
          <EventCalendar events={filteredEvents} />
        </>
      )}
    </div>
  );
}
