import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flights } from "@/data/mockData";

export default function FlightsPage() {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [maxPrice, setMaxPrice] = useState("all");

  const filtered = useMemo(() => {
    return flights.filter((f) => {
      const matchFrom = !searchFrom || f.departureCity.toLowerCase().includes(searchFrom.toLowerCase());
      const matchTo = !searchTo || f.arrivalCity.toLowerCase().includes(searchTo.toLowerCase());
      const matchPrice = maxPrice === "all" || f.price <= parseInt(maxPrice);
      return matchFrom && matchTo && matchPrice;
    });
  }, [searchFrom, searchTo, maxPrice]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl text-foreground mb-2">Flights to Morocco</h1>
        <p className="text-muted-foreground">Find the best deals on flights to Moroccan destinations.</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">From</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Departure city" value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">To</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Arrival city" value={searchTo} onChange={(e) => setSearchTo(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="min-w-[150px]">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Max Price</label>
          <Select value={maxPrice} onValueChange={setMaxPrice}>
            <SelectTrigger><SelectValue placeholder="Any price" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any price</SelectItem>
              <SelectItem value="100">Under $100</SelectItem>
              <SelectItem value="200">Under $200</SelectItem>
              <SelectItem value="500">Under $500</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No flights found. Try adjusting your filters.
          </div>
        )}
        {filtered.map((flight, i) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Plane className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">{flight.airline}</p>
                <p className="text-xs text-muted-foreground">{flight.stops === 0 ? "Direct" : `${flight.stops} stop(s)`}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="text-center">
                <p className="font-semibold text-card-foreground">{flight.departureTime}</p>
                <p className="text-xs text-muted-foreground">{flight.departureCity}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="h-px w-8 bg-border" />
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">{flight.duration}</span>
                <div className="h-px w-8 bg-border" />
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-card-foreground">{flight.arrivalTime}</p>
                <p className="text-xs text-muted-foreground">{flight.arrivalCity}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">${flight.price}</p>
                <p className="text-xs text-muted-foreground">per person</p>
              </div>
              <Button size="sm">Book</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
