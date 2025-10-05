import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const mockConversations = [
  { id: 1, title: "Improving hemoglobin levels", date: "Jan 15, 2025" },
  { id: 2, title: "Iron-rich food suggestions", date: "Jan 12, 2025" },
  { id: 3, title: "Understanding my test results", date: "Jan 08, 2025" },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI health assistant. How can I help you today?",
    timestamp: new Date(),
  },
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("hemoglobin") || lowerInput.includes("improve")) {
      return "Foods rich in iron like spinach, lentils, red meat, and fortified cereals can help improve hemoglobin levels. Also, vitamin C helps with iron absorption, so pair iron-rich foods with citrus fruits. Would you like more specific dietary recommendations?";
    } else if (lowerInput.includes("food") || lowerInput.includes("eat")) {
      return "For better hemoglobin levels, I recommend: 1) Leafy greens (spinach, kale), 2) Legumes (lentils, chickpeas), 3) Red meat and poultry, 4) Fortified cereals, 5) Nuts and seeds. Don't forget to stay hydrated!";
    } else if (lowerInput.includes("exercise") || lowerInput.includes("workout")) {
      return "Regular moderate exercise like walking, swimming, or yoga can help improve blood circulation and overall health. Aim for at least 30 minutes of activity most days of the week. Remember to consult your doctor before starting any new exercise routine.";
    } else {
      return "I'm here to help with your health questions! Feel free to ask me about nutrition, hemoglobin levels, lifestyle tips, or any health-related concerns you may have.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Chat History Sidebar */}
          <aside className="hidden lg:flex lg:w-64 border-r bg-card/50 flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Chat History</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {mockConversations.map((conv) => (
                  <button
                    key={conv.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <p className="font-medium text-sm truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">{conv.date}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col pb-20 md:pb-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <Card
                      className={`max-w-[80%] p-4 ${
                        message.role === "user"
                          ? "gradient-primary text-white"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.role === "assistant" && (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className={`text-sm ${message.role === "user" ? "text-white" : ""}`}>
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.role === "user" ? "text-white/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t bg-card/50 p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type your health question here..."
                    className="min-h-[60px] resize-none"
                  />
                  <Button
                    variant="gradient"
                    size="icon"
                    onClick={handleSend}
                    className="h-[60px] w-[60px] flex-shrink-0"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
