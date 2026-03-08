export interface Flight {
  id: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  price: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  stops: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  description: string;
  amenities: string[];
  image: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  description: string;
  includes: string[];
  image: string;
  rating: number;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  trending: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
