import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`;

export function useConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as ChatConversation[];
    },
    enabled: !!user,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!conversationId,
  });
}

export function useChatbot() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const createConversation = useCallback(async () => {
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ user_id: user.id, title: "New Chat" })
      .select()
      .single();

    if (error) throw error;
    setCurrentConversationId(data.id);
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    return data.id;
  }, [user, queryClient]);

  const sendMessage = useCallback(async (
    message: string,
    conversationId: string,
    existingMessages: { role: string; content: string }[]
  ) => {
    if (!user) throw new Error("Not authenticated");

    setIsLoading(true);

    try {
      // Save user message
      await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          role: "user",
          content: message,
        });

      // Call AI edge function
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            ...existingMessages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: message },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that request.";

      // Save assistant message
      await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: assistantMessage,
        });

      // Update conversation title if it's the first message
      if (existingMessages.length === 0) {
        const title = message.slice(0, 50) + (message.length > 50 ? "..." : "");
        await supabase
          .from("chat_conversations")
          .update({ title })
          .eq("id", conversationId);
      }

      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      return assistantMessage;
    } finally {
      setIsLoading(false);
    }
  }, [user, queryClient]);

  return {
    isLoading,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    sendMessage,
  };
}
