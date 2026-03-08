import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { packages } from "@/data/mockData";

export default function PackagesPage() {
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("all");

  const filtered = useMemo(() => {
    return packages.filter((p) => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.destination.toLowerCase().includes(search.toLowerCase());
      const matchPrice = maxPrice === "all" || p.price <= parseInt(maxPrice);
      return matchSearch && matchPrice;
    });
  }, [search, maxPrice]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl text-foreground mb-2">Travel Packages</h1>
        <p className="text-muted-foreground">All-inclusive Morocco experiences curated by travel experts.</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="min-w-[150px]">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Max Price</label>
          <Select value={maxPrice} onValueChange={setMaxPrice}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any price</SelectItem>
              <SelectItem value="500">Under $500</SelectItem>
              <SelectItem value="800">Under $800</SelectItem>
              <SelectItem value="1000">Under $1000</SelectItem>
              <SelectItem value="1500">Under $1500</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No packages found. Try adjusting your filters.
          </div>
        )}
        {filtered.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-56 overflow-hidden">
              <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">{pkg.duration}</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                <Star className="h-3 w-3 text-gold fill-gold" /> {pkg.rating}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {pkg.destination}
              </div>
              <h3 className="font-display text-xl text-card-foreground mb-2">{pkg.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {pkg.includes.map((item) => (
                  <span key={item} className="flex items-center gap-1 text-xs text-emerald">
                    <Check className="h-3 w-3" /> {item}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                  <span className="text-sm text-muted-foreground"> /person</span>
                </div>
                <Button>Book Package</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
