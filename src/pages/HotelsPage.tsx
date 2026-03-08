import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hotels } from "@/data/mockData";

export default function HotelsPage() {
  const [searchLocation, setSearchLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("all");
  const [minRating, setMinRating] = useState("all");

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      const matchLoc = !searchLocation || h.location.toLowerCase().includes(searchLocation.toLowerCase());
      const matchPrice = maxPrice === "all" || h.pricePerNight <= parseInt(maxPrice);
      const matchRating = minRating === "all" || h.rating >= parseFloat(minRating);
      return matchLoc && matchPrice && matchRating;
    });
  }, [searchLocation, maxPrice, minRating]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl text-foreground mb-2">Hotels & Riads</h1>
        <p className="text-muted-foreground">Discover authentic Moroccan accommodations — from luxurious riads to desert camps.</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Location</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by city" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="min-w-[150px]">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Max Price/Night</label>
          <Select value={maxPrice} onValueChange={setMaxPrice}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any price</SelectItem>
              <SelectItem value="100">Under $100</SelectItem>
              <SelectItem value="150">Under $150</SelectItem>
              <SelectItem value="200">Under $200</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[150px]">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Min Rating</label>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any rating</SelectItem>
              <SelectItem value="4.5">4.5+</SelectItem>
              <SelectItem value="4.7">4.7+</SelectItem>
              <SelectItem value="4.8">4.8+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No hotels found. Try adjusting your filters.
          </div>
        )}
        {filtered.map((hotel, i) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                <Star className="h-3 w-3 text-gold fill-gold" /> {hotel.rating}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {hotel.location}
              </div>
              <h3 className="font-display text-lg text-card-foreground mb-2">{hotel.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{hotel.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hotel.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    <Wifi className="h-3 w-3" /> {a}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-primary">${hotel.pricePerNight}</span>
                  <span className="text-sm text-muted-foreground"> /night</span>
                </div>
                <Button size="sm">Book Now</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
