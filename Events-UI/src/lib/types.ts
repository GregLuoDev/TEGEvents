export type Event = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  venueId: number;
};

export type Venue = {
  id: number;
  name: string;
  capacity: number;
  location: string;
};
