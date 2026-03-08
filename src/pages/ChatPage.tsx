import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Hotel, Plane, Sun } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { streamChat } from "@/lib/streamChat";
import type { ChatMessage } from "@/types/travel";

const suggestions = [
  "Plan a 7-day trip to Morocco with beaches and desert",
  "Best time to visit Marrakech?",
  "Suggest budget-friendly hotels in Chefchaouen",
  "Create an itinerary for the Imperial Cities",
];

const WELCOME = `# 🇲🇦 Welcome to AtlasTrip AI!

I'm your AI travel assistant for Morocco. I can help you with:

- **🗺️ Trip Planning** — Custom itineraries based on your preferences
- **✈️ Flight Search** — Finding the best flight deals
- **🏨 Hotel Recommendations** — From luxury riads to desert camps
- **☀️ Weather Info** — Best times to visit each region
- **📊 Budget Estimates** — Plan your spending

What kind of Moroccan adventure are you dreaming of?`;

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: WELCOME, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = text || input;
    if (!message.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Build history for API (exclude welcome message)
    const history = [...messages.filter((m) => m.id !== "1"), userMsg].map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    let assistantSoFar = "";
    const assistantId = (Date.now() + 1).toString();

    try {
      await streamChat({
        messages: history,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          const snapshot = assistantSoFar;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.id === assistantId) {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: snapshot } : m
              );
            }
            return [
              ...prev,
              { id: assistantId, role: "assistant", content: snapshot, timestamp: new Date() },
            ];
          });
        },
        onDone: () => setIsStreaming(false),
        onError: (error) => {
          toast({ title: "AI Error", description: error, variant: "destructive" });
          setIsStreaming(false);
        },
      });
    } catch {
      toast({ title: "Connection Error", description: "Could not reach AI service.", variant: "destructive" });
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="container flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display text-card-foreground">AtlasTrip AI Assistant</h1>
            <p className="text-xs text-muted-foreground">Powered by multi-agent AI — Flight, Hotel, Weather & Deals agents</p>
          </div>
          <div className="ml-auto flex gap-1.5">
            {[Plane, Hotel, Sun, Sparkles].map((Icon, i) => (
              <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl py-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-card-foreground"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none text-card-foreground [&_h1]:font-display [&_h1]:text-xl [&_h1]:mb-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_p]:text-sm [&_li]:text-sm [&_table]:text-xs [&_strong]:text-card-foreground [&_th]:text-card-foreground [&_td]:text-muted-foreground">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-2xl bg-card border border-border px-5 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="border-t border-border bg-card/50 px-6 py-3">
          <div className="container max-w-3xl">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-card-foreground transition-colors hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="container max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about flights, hotels, or plan your Morocco trip..."
              className="flex-1"
              disabled={isStreaming}
            />
            <Button type="submit" disabled={!input.trim() || isStreaming} className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
