import { createSlice } from '@reduxjs/toolkit';
import { Event, Venue } from '../types';
import { fetchEvents, fetchVenues } from '../thunks/eventAsyncThunks';

type EventState = {
  events: Event[];
  isLoadingEvents: boolean;
  fetchingEventsError: string;

  venues: Venue[];
  isLoadingVenues: boolean;
  fetchingVenuesError: string;
};

const initialState: EventState = {
  events: [],
  isLoadingEvents: true,
  fetchingEventsError: '',

  venues: [],
  isLoadingVenues: true,
  fetchingVenuesError: '',
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoadingEvents = true;
        state.fetchingEventsError = '';
        state.events = [];
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoadingEvents = false;
        state.events = action.payload;
        state.fetchingEventsError = '';
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoadingEvents = false;
        state.fetchingEventsError = action.payload as string;
        state.events = [];
      })

      .addCase(fetchVenues.pending, (state) => {
        state.isLoadingVenues = true;
        state.fetchingVenuesError = '';
        state.venues = [];
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.isLoadingVenues = false;
        state.venues = action.payload;
        state.fetchingVenuesError = '';
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.isLoadingVenues = false;
        state.fetchingVenuesError = action.payload as string;
        state.venues = [];
      });
  },
});

export default eventSlice.reducer;
