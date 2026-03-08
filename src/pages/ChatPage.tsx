import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, MapPin, Hotel, Plane, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@/types/travel";

const suggestions = [
  "Plan a 7-day trip to Morocco with beaches and desert",
  "Best time to visit Marrakech?",
  "Suggest budget-friendly hotels in Chefchaouen",
  "Create an itinerary for the Imperial Cities",
];

// Simulated AI responses (will be replaced with real AI later)
const mockResponses: Record<string, string> = {
  default: `# 🇲🇦 Welcome to AtlasTrip AI!

I'm your AI travel assistant for Morocco. I can help you with:

- **🗺️ Trip Planning** — Custom itineraries based on your preferences
- **✈️ Flight Search** — Finding the best flight deals
- **🏨 Hotel Recommendations** — From luxury riads to desert camps
- **☀️ Weather Info** — Best times to visit each region
- **📊 Budget Estimates** — Plan your spending

What kind of Moroccan adventure are you dreaming of?`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("7-day") || lower.includes("7 day") || lower.includes("week")) {
    return `# 🏖️ 7-Day Morocco: Beaches & Desert

Here's your personalized itinerary:

## Day 1-2: Marrakech
- Explore Jemaa el-Fnaa square
- Visit Bahia Palace & Majorelle Garden
- 🏨 **Riad Yasmine** — $120/night

## Day 3-4: Sahara Desert
- Drive through Atlas Mountains
- Camel trek at sunset
- 🏨 **Sahara Luxury Camp** — $200/night

## Day 5-6: Essaouira
- Atlantic beaches & surfing
- Fresh seafood at the port
- 🏨 **L'Heure Bleue Palais** — $180/night

## Day 7: Return to Marrakech
- Last-minute shopping in the souks
- Hammam spa experience

### 💰 Estimated Budget: $1,800-2,200/person
### ☀️ Best Period: March-May or September-November`;
  }
  if (lower.includes("best time") || lower.includes("when")) {
    return `# ☀️ Best Time to Visit Morocco

| Season | Months | Weather | Best For |
|--------|--------|---------|----------|
| 🌸 Spring | Mar-May | 20-28°C | Ideal for all regions |
| ☀️ Summer | Jun-Aug | 30-45°C | Coastal cities only |
| 🍂 Autumn | Sep-Nov | 20-30°C | Desert & mountains |
| ❄️ Winter | Dec-Feb | 8-18°C | Sahara & southern |

**My recommendation:** Visit in **April or October** for the perfect balance of pleasant weather across all regions.`;
  }
  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("chefchaouen")) {
    return `# 🏨 Budget Hotels in Chefchaouen

1. **Casa Hassan** — $85/night ⭐ 4.6
   - Heart of the blue medina
   - Rooftop terrace with mountain views
   - Includes breakfast

2. **Dar Echchaouen** — $65/night ⭐ 4.4
   - Traditional Moroccan house
   - WiFi & breakfast included

3. **Hotel Parador** — $55/night ⭐ 4.2
   - Great location near the main square
   - Basic but clean rooms

### 💡 Tip: Book 2-3 months in advance for the best rates!`;
  }
  if (lower.includes("imperial") || lower.includes("cities") || lower.includes("itinerary")) {
    return `# 👑 Imperial Cities Tour — 10 Days

## Marrakech (Days 1-3)
- Koutoubia Mosque, Bahia Palace
- Jemaa el-Fnaa by night
- Day trip to Atlas Mountains

## Fes (Days 4-6)
- World's largest car-free zone
- Tanneries & artisan workshops
- Bou Inania Madrasa

## Meknes (Days 7-8)
- Bab Mansour gate
- Royal Granaries
- Day trip to Volubilis ruins

## Rabat (Days 9-10)
- Hassan Tower
- Kasbah of the Udayas
- Mohammed V Mausoleum

### 💰 Estimated: $1,299/person (our Imperial Cities package!)
### 🚗 Transport: Private driver included`;
  }
  return mockResponses.default;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: mockResponses.default, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(message);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
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
                    {msg.content.split("\n").map((line, i) => {
                      if (line.startsWith("# ")) return <h1 key={i}>{line.slice(2)}</h1>;
                      if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
                      if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
                      if (line.startsWith("- ")) return <li key={i}>{line.slice(2)}</li>;
                      if (line.startsWith("|")) return <p key={i} className="font-mono text-xs">{line}</p>;
                      if (line.trim() === "") return <br key={i} />;
                      return <p key={i}>{line}</p>;
                    })}
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
          {isTyping && (
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
              disabled={isTyping}
            />
            <Button type="submit" disabled={!input.trim() || isTyping} className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
