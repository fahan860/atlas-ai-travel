import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a specialized Flight Search Agent for Morocco travel. You search and recommend flights to Moroccan destinations.

When given a flight search query, return structured JSON using the search_flights tool. Generate realistic flight options based on:
- Common airlines serving Morocco (Royal Air Maroc, Ryanair, easyJet, Air France, Turkish Airlines, Emirates, Iberia)
- Real Moroccan airports: Marrakech (RAK), Casablanca (CMN), Fes (FEZ), Tangier (TNG), Agadir (AGA), Rabat (RBA), Essaouira (ESU)
- Realistic pricing: Budget €30-80, Mid-range €100-250, Premium €300-600
- Flight durations based on actual routes
- Include both direct and connecting flights

Always provide 4-6 flight options with varied price points and airlines.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to, date, passengers, budget } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Search flights from "${from || "any city"}" to "${to || "Morocco"}" on ${date || "flexible dates"} for ${passengers || 1} passenger(s). Budget preference: ${budget || "any"}. Return results using the search_flights tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "search_flights",
              description: "Return flight search results",
              parameters: {
                type: "object",
                properties: {
                  flights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        airline: { type: "string" },
                        departureCity: { type: "string" },
                        arrivalCity: { type: "string" },
                        departureTime: { type: "string" },
                        arrivalTime: { type: "string" },
                        duration: { type: "string" },
                        price: { type: "number" },
                        stops: { type: "number" },
                        bookingUrl: { type: "string" },
                      },
                      required: ["id", "airline", "departureCity", "arrivalCity", "departureTime", "arrivalTime", "duration", "price", "stops"],
                      additionalProperties: false,
                    },
                  },
                  summary: { type: "string" },
                },
                required: ["flights", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "search_flights" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ flights: [], summary: "No results found." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("flights-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
