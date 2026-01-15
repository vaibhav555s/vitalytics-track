import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Report {
  id: string;
  user_id: string;
  reading_id: string | null;
  file_url: string;
  file_name: string | null;
  uploaded_at: string;
}

export function useReports() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reports", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          readings (
            value,
            unit,
            reading_date
          )
        `)
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUploadReport() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      readingId,
    }: {
      file: File;
      readingId?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("reports")
        .getPublicUrl(fileName);

      // Create report record
      const { data, error } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          file_url: urlData.publicUrl,
          file_name: file.name,
          reading_id: readingId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (reportId: string) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
