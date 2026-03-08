import marrakechImg from "@/assets/marrakech.jpg";
import saharaImg from "@/assets/sahara.jpg";
import chefchaouenImg from "@/assets/chefchaouen.jpg";
import essaouiraImg from "@/assets/essaouira.jpg";
import fesImg from "@/assets/fes.jpg";
import type { Flight, Hotel, TravelPackage, Destination } from "@/types/travel";

export const destinations: Destination[] = [
  { id: "1", name: "Marrakech", description: "The Red City — vibrant souks, palaces & gardens", image: marrakechImg, trending: true },
  { id: "2", name: "Sahara Desert", description: "Golden dunes, starlit camps & camel treks", image: saharaImg, trending: true },
  { id: "3", name: "Chefchaouen", description: "The Blue Pearl of Morocco", image: chefchaouenImg, trending: true },
  { id: "4", name: "Essaouira", description: "Coastal charm with Atlantic breeze", image: essaouiraImg, trending: false },
  { id: "5", name: "Fes", description: "Ancient medina & artisan heritage", image: fesImg, trending: true },
];

export const flights: Flight[] = [
  { id: "f1", airline: "Royal Air Maroc", departureCity: "Paris", arrivalCity: "Marrakech", price: 189, duration: "3h 20m", departureTime: "08:00", arrivalTime: "11:20", stops: 0 },
  { id: "f2", airline: "Ryanair", departureCity: "London", arrivalCity: "Marrakech", price: 79, duration: "3h 45m", departureTime: "06:30", arrivalTime: "10:15", stops: 0 },
  { id: "f3", airline: "Air France", departureCity: "Paris", arrivalCity: "Casablanca", price: 220, duration: "3h 10m", departureTime: "14:00", arrivalTime: "17:10", stops: 0 },
  { id: "f4", airline: "Royal Air Maroc", departureCity: "New York", arrivalCity: "Casablanca", price: 450, duration: "7h 30m", departureTime: "22:00", arrivalTime: "10:30", stops: 0 },
  { id: "f5", airline: "Iberia", departureCity: "Madrid", arrivalCity: "Marrakech", price: 120, duration: "1h 30m", departureTime: "10:00", arrivalTime: "11:30", stops: 0 },
  { id: "f6", airline: "TUI fly", departureCity: "Amsterdam", arrivalCity: "Agadir", price: 159, duration: "4h 00m", departureTime: "07:00", arrivalTime: "11:00", stops: 0 },
  { id: "f7", airline: "Royal Air Maroc", departureCity: "Casablanca", arrivalCity: "Fes", price: 65, duration: "0h 55m", departureTime: "09:00", arrivalTime: "09:55", stops: 0 },
  { id: "f8", airline: "EasyJet", departureCity: "Barcelona", arrivalCity: "Marrakech", price: 95, duration: "2h 15m", departureTime: "12:00", arrivalTime: "14:15", stops: 0 },
];

export const hotels: Hotel[] = [
  { id: "h1", name: "Riad Yasmine", location: "Marrakech", pricePerNight: 120, rating: 4.8, description: "A stunning boutique riad with a turquoise pool in the heart of the Medina.", amenities: ["Pool", "WiFi", "Breakfast", "Spa"], image: marrakechImg },
  { id: "h2", name: "Sahara Luxury Camp", location: "Merzouga", pricePerNight: 200, rating: 4.9, description: "Glamping under the stars in the Sahara with traditional Berber hospitality.", amenities: ["Desert Tours", "Meals", "Campfire", "Stargazing"], image: saharaImg },
  { id: "h3", name: "Casa Hassan", location: "Chefchaouen", pricePerNight: 85, rating: 4.6, description: "Charming guesthouse in the blue medina with panoramic terrace.", amenities: ["WiFi", "Breakfast", "Terrace", "Tour Desk"], image: chefchaouenImg },
  { id: "h4", name: "L'Heure Bleue Palais", location: "Essaouira", pricePerNight: 180, rating: 4.7, description: "An elegant palace hotel near the ramparts with ocean views.", amenities: ["Pool", "WiFi", "Restaurant", "Hammam"], image: essaouiraImg },
  { id: "h5", name: "Riad Fes Maya", location: "Fes", pricePerNight: 150, rating: 4.8, description: "Luxurious riad with zellige tilework and a serene courtyard.", amenities: ["WiFi", "Breakfast", "Hammam", "Cooking Class"], image: fesImg },
  { id: "h6", name: "Atlas Kasbah Ecolodge", location: "Agadir", pricePerNight: 95, rating: 4.5, description: "Eco-friendly lodge with stunning mountain views.", amenities: ["Pool", "WiFi", "Organic Meals", "Hiking"], image: marrakechImg },
];

export const packages: TravelPackage[] = [
  { id: "p1", title: "Imperial Cities Tour", destination: "Marrakech, Fes, Meknes, Rabat", duration: "10 days", price: 1299, description: "Explore Morocco's four imperial cities with guided tours, luxury riads, and authentic cuisine.", includes: ["Hotels", "Guided Tours", "Breakfast", "Airport Transfer"], image: fesImg, rating: 4.9 },
  { id: "p2", title: "Sahara Desert Adventure", destination: "Marrakech to Merzouga", duration: "5 days", price: 699, description: "Journey from Marrakech through the Atlas Mountains to the golden Sahara dunes.", includes: ["Hotels", "Desert Camp", "Camel Trek", "All Meals"], image: saharaImg, rating: 4.8 },
  { id: "p3", title: "Coastal Escape", destination: "Essaouira & Agadir", duration: "7 days", price: 899, description: "Relax on Atlantic beaches, explore medinas, and enjoy fresh seafood.", includes: ["Hotels", "Breakfast", "Surfing Lesson", "City Tour"], image: essaouiraImg, rating: 4.7 },
  { id: "p4", title: "Blue Pearl Retreat", destination: "Chefchaouen & Tangier", duration: "4 days", price: 499, description: "Wander through blue-washed streets and discover northern Morocco's charm.", includes: ["Hotels", "Breakfast", "Hiking Guide", "Transfer"], image: chefchaouenImg, rating: 4.6 },
];
