import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Hotel, Package, MessageSquare, MapPin, TrendingUp, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { destinations, packages } from "@/data/mockData";
import heroImg from "@/assets/hero-morocco.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Morocco aerial view"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
        <div className="container relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-5xl font-display leading-tight text-primary-foreground md:text-7xl"
          >
            Discover Morocco
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80 font-body"
          >
            Let AI plan your perfect Moroccan adventure — from imperial cities to Saharan dunes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/chat">
              <Button size="lg" className="gap-2 text-base">
                <MessageSquare className="h-5 w-5" />
                Plan with AI
              </Button>
            </Link>
            <Link to="/packages">
              <Button size="lg" variant="outline" className="gap-2 text-base border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                <Package className="h-5 w-5" />
                Browse Packages
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container -mt-16 relative z-20">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Plane, label: "Flights", desc: "Find cheap flights", to: "/flights" },
            { icon: Hotel, label: "Hotels", desc: "Riads & resorts", to: "/hotels" },
            { icon: Package, label: "Packages", desc: "All-inclusive deals", to: "/packages" },
            { icon: MessageSquare, label: "AI Assistant", desc: "Plan your trip", to: "/chat" },
          ].map((item, i) => (
            <motion.div key={item.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Link to={item.to} className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="container py-20">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl text-foreground">Popular Destinations</h2>
          </div>
          <Link to="/packages" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {destinations.filter(d => d.trending).map((dest, i) => (
            <motion.div
              key={dest.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl"
            >
              <img src={dest.image} alt={dest.name} className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">Morocco</span>
                </div>
                <h3 className="text-xl font-display text-primary-foreground">{dest.name}</h3>
                <p className="text-sm text-primary-foreground/70">{dest.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="bg-secondary/50 py-20">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl text-foreground mb-3">Featured Packages</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Curated experiences combining the best of Morocco — hotels, tours, and local cuisine.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {packages.slice(0, 4).map((pkg, i) => (
              <motion.div
                key={pkg.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md md:flex-row"
              >
                <img src={pkg.image} alt={pkg.title} className="h-48 w-full object-cover md:h-auto md:w-48 transition-transform duration-500 group-hover:scale-105" />
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{pkg.duration}</span>
                      <span className="flex items-center gap-1 text-xs text-gold">
                        <Star className="h-3 w-3 fill-current" /> {pkg.rating}
                      </span>
                    </div>
                    <h3 className="text-lg font-display text-card-foreground mb-1">{pkg.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{pkg.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                      <span className="text-sm text-muted-foreground"> /person</span>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-primary p-10 md:p-16 text-center"
        >
          <div className="relative z-10">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-primary-foreground/80" />
            <h2 className="text-3xl md:text-4xl font-display text-primary-foreground mb-4">
              Let AI Plan Your Trip
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
              Tell our AI assistant what you're looking for and get a personalized Morocco itinerary in seconds.
            </p>
            <Link to="/chat">
              <Button size="lg" variant="secondary" className="gap-2 text-base">
                <MessageSquare className="h-5 w-5" />
                Start Planning
              </Button>
            </Link>
          </div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary-foreground" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-foreground" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
