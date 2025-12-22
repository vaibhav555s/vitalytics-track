import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useConversations, useMessages, useChatbot } from "@/hooks/useChatbot";

export default function Chatbot() {
  const { data: conversations } = useConversations();
  const { isLoading, currentConversationId, setCurrentConversationId, createConversation, sendMessage } = useChatbot();
  const { data: messages } = useMessages(currentConversationId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input;
    setInput("");

    try {
      let convId = currentConversationId;
      if (!convId) {
        convId = await createConversation();
      }

      await sendMessage(messageText, convId, messages || []);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleNewChat = async () => {
    const convId = await createConversation();
    setCurrentConversationId(convId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Chat History Sidebar */}
          <aside className="hidden lg:flex lg:w-64 border-r bg-card/50 flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Chat History</h2>
              <Button variant="ghost" size="icon" onClick={handleNewChat}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {conversations?.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setCurrentConversationId(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentConversationId === conv.id ? 'bg-primary/10' : 'hover:bg-accent'
                    }`}
                  >
                    <p className="font-medium text-sm truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
                {(!conversations || conversations.length === 0) && (
                  <p className="text-sm text-muted-foreground p-3">No conversations yet</p>
                )}
              </div>
            </ScrollArea>
          </aside>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col pb-20 md:pb-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="max-w-3xl mx-auto space-y-4">
                {!currentConversationId && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">AI Health Assistant</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask me anything about hemoglobin, nutrition, or blood health!
                    </p>
                  </div>
                )}
                {messages?.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <Card className={`max-w-[80%] p-4 ${
                      message.role === "user" ? "gradient-primary text-white" : "bg-card"
                    }`}>
                      <div className="flex items-start gap-3">
                        {message.role === "assistant" && (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className={`text-sm whitespace-pre-wrap ${message.role === "user" ? "text-white" : ""}`}>
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="p-4 bg-card">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t bg-card/50 p-4">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about hemoglobin, nutrition, or blood health..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  variant="gradient"
                  size="icon"
                  onClick={handleSend}
                  className="h-[60px] w-[60px] flex-shrink-0"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
