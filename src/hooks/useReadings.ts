import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Reading {
  id: string;
  user_id: string;
  value: number;
  unit: string;
  reading_date: string;
  reading_time: string;
  notes: string | null;
  mood: string | null;
  status: string | null;
  created_at: string;
}

export function useReadings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["readings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .eq("user_id", user.id)
        .order("reading_date", { ascending: false })
        .order("reading_time", { ascending: false });

      if (error) throw error;
      return data as Reading[];
    },
    enabled: !!user,
  });
}

export function useLatestReading() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["latestReading", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("readings")
        .select("*")
        .eq("user_id", user.id)
        .order("reading_date", { ascending: false })
        .order("reading_time", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Reading | null;
    },
    enabled: !!user,
  });
}

export function useMonthlyReadingsCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["monthlyReadingsCount", user?.id],
    queryFn: async () => {
      if (!user) return { current: 0, previous: 0 };
      
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

      const { count: currentCount } = await supabase
        .from("readings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("reading_date", firstDayThisMonth);

      const { count: previousCount } = await supabase
        .from("readings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("reading_date", firstDayLastMonth)
        .lte("reading_date", lastDayLastMonth);

      return { current: currentCount || 0, previous: previousCount || 0 };
    },
    enabled: !!user,
  });
}

export function useAddReading() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (reading: {
      value: number;
      unit: string;
      reading_date: string;
      reading_time: string;
      notes?: string;
      mood?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Determine status based on value
      let status = "normal";
      if (reading.value < 10) status = "critical";
      else if (reading.value < 12) status = "low";

      const { data, error } = await supabase
        .from("readings")
        .insert({
          user_id: user.id,
          value: reading.value,
          unit: reading.unit,
          reading_date: reading.reading_date,
          reading_time: reading.reading_time,
          notes: reading.notes || null,
          mood: reading.mood || null,
          status,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings"] });
      queryClient.invalidateQueries({ queryKey: ["latestReading"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyReadingsCount"] });
    },
  });
}
