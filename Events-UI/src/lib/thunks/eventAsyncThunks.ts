import { createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
//'https://events-webapi20251110151234-fbh0ezhucsbhcshr.canadacentral-01.azurewebsites.net'; // 'https://localhost:7120';

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
      const response = await fetch(`${baseUrl}/api/events/venues`);
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
