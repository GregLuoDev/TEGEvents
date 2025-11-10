import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Event } from '../types';

const baseUrl =
  'https://events-webapi20251110151234-fbh0ezhucsbhcshr.canadacentral-01.azurewebsites.net'; // 'https://localhost:7120';

export const fetchEvents = createAsyncThunk(
  `${baseUrl}/api/events`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Something went wrong');
    }
  },
);

export const fetchVenues = createAsyncThunk(
  `${baseUrl}/api/events/venues`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Something went wrong');
    }
  },
);

export const createEvent = createAsyncThunk<Event, Event>(
  'createEvent',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post<Event>(`${baseUrl}/api/events`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue('Something went wrong');
    }
  },
);

export const updateEvent = createAsyncThunk<Event, Event>(
  'updateEvent',
  async (data, { rejectWithValue }) => {
    try {
      await axios.put<Event>(`${baseUrl}/api/events/${data.id}`, data);
      return data;
    } catch (err) {
      return rejectWithValue('Something went wrong');
    }
  },
);

export const deleteEvent = createAsyncThunk<number, number>(
  'deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete<Event>(`${baseUrl}/api/events/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue('Something went wrong');
    }
  },
);
