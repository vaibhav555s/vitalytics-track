import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AlertSettings {
  id: string;
  user_id: string;
  low_threshold: number;
  critical_threshold: number;
  smart_alerts_enabled: boolean;
  health_reminders_enabled: boolean;
  weekly_reports_enabled: boolean;
  updated_at: string;
}

export function useAlertSettings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["alertSettings", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("alert_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as AlertSettings | null;
    },
    enabled: !!user,
  });
}

export function useUpdateAlertSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: {
      low_threshold?: number;
      critical_threshold?: number;
      smart_alerts_enabled?: boolean;
      health_reminders_enabled?: boolean;
      weekly_reports_enabled?: boolean;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("alert_settings")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alertSettings"] });
    },
  });
}
