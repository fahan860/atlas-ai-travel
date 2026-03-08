import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MapPin, Calendar, DollarSign, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  activities: string[];
}

export default function PlannerPage() {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: "1",
      destination: "Marrakech & Sahara",
      startDate: "2026-04-10",
      endDate: "2026-04-17",
      budget: 2000,
      activities: ["Medina tour", "Camel trek", "Hammam spa", "Cooking class"],
    },
  ]);
  const [newTrip, setNewTrip] = useState({ destination: "", startDate: "", endDate: "", budget: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const addTrip = () => {
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate) return;
    setTrips((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        destination: newTrip.destination,
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        budget: parseInt(newTrip.budget) || 0,
        activities: [],
      },
    ]);
    setNewTrip({ destination: "", startDate: "", endDate: "", budget: "" });
    setDialogOpen(false);
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl text-foreground mb-2">Trip Planner</h1>
          <p className="text-muted-foreground">Create and manage your Morocco travel plans.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Trip
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Create New Trip</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Destination</label>
                <Input placeholder="e.g., Marrakech" value={newTrip.destination} onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Start Date</label>
                  <Input type="date" value={newTrip.startDate} onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">End Date</label>
                  <Input type="date" value={newTrip.endDate} onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Budget ($)</label>
                <Input type="number" placeholder="2000" value={newTrip.budget} onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })} />
              </div>
              <Button onClick={addTrip} className="w-full">Create Trip</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-16 text-center">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="font-display text-xl text-card-foreground mb-2">No trips yet</h3>
          <p className="text-muted-foreground mb-4">Start planning your Moroccan adventure!</p>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Create Your First Trip
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl text-card-foreground">{trip.destination}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      ${trip.budget}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTrip(trip.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {trip.activities.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Activities</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.activities.map((a) => (
                      <span key={a} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
