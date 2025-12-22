import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialization: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

export function useDoctors() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["doctors", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Doctor[];
    },
    enabled: !!user,
  });
}

export function useAddDoctor() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (doctor: {
      name: string;
      specialization?: string;
      phone?: string;
      email?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("doctors")
        .insert({
          user_id: user.id,
          name: doctor.name,
          specialization: doctor.specialization || null,
          phone: doctor.phone || null,
          email: doctor.email || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}
