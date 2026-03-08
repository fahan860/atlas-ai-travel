const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const AUTH_HEADER = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;

async function callAgent<T>(functionName: string, body: Record<string, unknown>): Promise<T> {
  const resp = await fetch(`${BASE_URL}/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTH_HEADER,
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.error || `Agent error ${resp.status}`);
  }

  return data as T;
}

// Flight Agent
export interface FlightResult {
  id: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  bookingUrl?: string;
}

export interface FlightSearchResponse {
  flights: FlightResult[];
  summary: string;
}

export function searchFlights(params: {
  from?: string;
  to?: string;
  date?: string;
  passengers?: number;
  budget?: string;
}) {
  return callAgent<FlightSearchResponse>("flights-agent", params);
}

// Hotel Agent
export interface HotelResult {
  id: string;
  name: string;
  location: string;
  type: string;
  pricePerNight: number;
  rating: number;
  description: string;
  amenities: string[];
  image?: string;
}

export interface HotelSearchResponse {
  hotels: HotelResult[];
  summary: string;
}

export function searchHotels(params: {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  budget?: string;
  type?: string;
}) {
  return callAgent<HotelSearchResponse>("hotels-agent", params);
}

// Weather Agent
export interface WeatherResponse {
  location: string;
  current: {
    tempHigh: number;
    tempLow: number;
    condition: string;
    humidity: number;
    rainfall: string;
  };
  bestMonths: string[];
  avoidMonths: string[];
  packingTips: string[];
  summary: string;
}

export function getWeather(params: { location?: string; month?: string }) {
  return callAgent<WeatherResponse>("weather-agent", params);
}

// Itinerary Agent
export interface ItineraryActivity {
  time: string;
  activity: string;
  description: string;
  estimatedCost: number;
  tip?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  activities: ItineraryActivity[];
}

export interface ItineraryResponse {
  title: string;
  destination: string;
  totalDays: number;
  estimatedBudget: number;
  days: ItineraryDay[];
  packingList?: string[];
  summary: string;
}

export function generateItinerary(params: {
  destination?: string;
  days?: number;
  budget?: number;
  interests?: string;
  startDate?: string;
}) {
  return callAgent<ItineraryResponse>("itinerary-agent", params);
}
