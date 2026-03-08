import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { ItineraryResponse } from "@/lib/agentClient";

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  activities: string[];
  itinerary?: ItineraryResponse;
}

interface TripRow {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  activities: string[];
  itinerary: ItineraryResponse | null;
  user_id: string;
}

function rowToTrip(row: TripRow): Trip {
  return {
    id: row.id,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.budget,
    activities: (row.activities as string[]) || [],
    itinerary: row.itinerary as ItineraryResponse | undefined,
  };
}

export function useTrips() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tripsQuery = useQuery({
    queryKey: ["trips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as TripRow[]).map(rowToTrip);
    },
    enabled: !!user,
  });

  const addTrip = useMutation({
    mutationFn: async (trip: { destination: string; startDate: string; endDate: string; budget: number }) => {
      const { data, error } = await supabase
        .from("trips")
        .insert({
          user_id: user!.id,
          destination: trip.destination,
          start_date: trip.startDate,
          end_date: trip.endDate,
          budget: trip.budget,
          activities: [],
        })
        .select()
        .single();
      if (error) throw error;
      return rowToTrip(data as unknown as TripRow);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
    onError: (e) => toast({ title: "Failed to save trip", description: e.message, variant: "destructive" }),
  });

  const deleteTrip = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
    onError: (e) => toast({ title: "Failed to delete trip", description: e.message, variant: "destructive" }),
  });

  const updateTrip = useMutation({
    mutationFn: async (trip: { id: string; activities?: string[]; itinerary?: ItineraryResponse }) => {
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (trip.activities) updates.activities = trip.activities;
      if (trip.itinerary) updates.itinerary = trip.itinerary;
      const { error } = await supabase.from("trips").update(updates).eq("id", trip.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips"] }),
    onError: (e) => toast({ title: "Failed to update trip", description: e.message, variant: "destructive" }),
  });

  return { trips: tripsQuery.data ?? [], isLoading: tripsQuery.isLoading, addTrip, deleteTrip, updateTrip };
}
