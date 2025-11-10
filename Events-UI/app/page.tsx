'use client';

import { useAppDispatch, useAppSelector } from '@/src/lib/store';
import { fetchEvents } from '@/src/lib/thunks/eventAsyncThunks';
import { Alert, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function Home() {
  const dispatch = useAppDispatch();
  const { events, isLoadingEvents, fetchingEventsError } = useAppSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="container mx-auto mt-4">
      <Typography variant="h6" gutterBottom>
        What's on at TEG Staduim!
      </Typography>

      <div className="my-4">
        {isLoadingEvents && !fetchingEventsError && <CircularProgress />}

        {!isLoadingEvents && !!fetchingEventsError && (
          <Alert severity="error">Cannot fetch data. Please try again.</Alert>
        )}

        {!isLoadingEvents && !fetchingEventsError && (
          <>Events:{events.length}</>
          // <EventsBoard initial={{ columns }} key={JSON.stringify(events)} />
        )}
      </div>
    </div>
  );
}
