import { createSlice } from '@reduxjs/toolkit';
import { Event, Venue } from '../types';
import {
  createEvent,
  deleteEvent,
  fetchEvents,
  fetchVenues,
  updateEvent,
} from '../thunks/eventAsyncThunks';

type EventState = {
  events: Event[];
  isLoadingEvents: boolean;
  fetchingEventsError: string;

  venues: Venue[];
  isLoadingVenues: boolean;
  fetchingVenuesError: string;

  currentEvent: Event | null;
  isLoadingEvent: boolean;
  isCreatingEvent: boolean;
  isUpdatingEvent: boolean;
  isDeletingEvent: boolean;
  error: string;
};

const initialState: EventState = {
  events: [],
  isLoadingEvents: true,
  fetchingEventsError: '',

  venues: [],
  isLoadingVenues: true,
  fetchingVenuesError: '',

  currentEvent: null,
  isLoadingEvent: false,
  isCreatingEvent: false,
  isUpdatingEvent: false,
  isDeletingEvent: false,
  error: '',
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
  },
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
      })

      .addCase(createEvent.pending, (state) => {
        state.isCreatingEvent = true;
        state.error = '';
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isCreatingEvent = false;
        state.error = '';
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isCreatingEvent = false;
        state.error = action.payload as string;
      })

      .addCase(updateEvent.pending, (state) => {
        state.isUpdatingEvent = true;
        state.error = '';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isUpdatingEvent = false;
        state.error = '';
        state.events = state.events.map((event) => {
          const newEvent = action.payload;
          if (event.id === newEvent.id) {
            return { ...event, ...newEvent, updatedAt: new Date().toISOString() };
          }
          return event;
        });
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isUpdatingEvent = false;
        state.error = action.payload as string;
      })

      .addCase(deleteEvent.pending, (state) => {
        state.isDeletingEvent = true;
        state.error = '';
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isDeletingEvent = false;
        state.error = '';
        state.events = state.events.filter((t) => {
          const id = action.payload;
          return t.id !== id;
        });
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isDeletingEvent = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = eventSlice.actions;
export default eventSlice.reducer;
