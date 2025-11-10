// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import eventReducer from './slices/eventSlice';

const rootReducer = combineReducers({
  event: eventReducer,
});

export default rootReducer;
