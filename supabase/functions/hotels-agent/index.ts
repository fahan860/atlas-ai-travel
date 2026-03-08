import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a specialized Hotel Agent for Morocco travel. You recommend hotels, riads, and accommodations across Morocco.

When given a hotel search query, return structured JSON using the search_hotels tool. Generate realistic recommendations based on:
- Types: Traditional riads, luxury hotels, boutique hotels, desert camps, surf hostels, kasbahs
- Cities: Marrakech, Fes, Chefchaouen, Essaouira, Casablanca, Tangier, Merzouga, Ouarzazate, Agadir
- Realistic pricing: Budget $30-70, Mid-range $80-150, Luxury $150-400+
- Ratings between 4.0-4.9
- Authentic amenities: rooftop terrace, hammam, courtyard pool, cooking classes, guided tours

Always provide 4-6 accommodation options with varied price points and types.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, checkIn, checkOut, guests, budget, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Search accommodations in "${location || "Morocco"}" for ${guests || 2} guests, check-in ${checkIn || "flexible"}, check-out ${checkOut || "flexible"}. Budget: ${budget || "any"}. Type preference: ${type || "any"}. Return results using the search_hotels tool.`;

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
              name: "search_hotels",
              description: "Return hotel search results",
              parameters: {
                type: "object",
                properties: {
                  hotels: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        location: { type: "string" },
                        type: { type: "string" },
                        pricePerNight: { type: "number" },
                        rating: { type: "number" },
                        description: { type: "string" },
                        amenities: { type: "array", items: { type: "string" } },
                        image: { type: "string" },
                      },
                      required: ["id", "name", "location", "type", "pricePerNight", "rating", "description", "amenities"],
                      additionalProperties: false,
                    },
                  },
                  summary: { type: "string" },
                },
                required: ["hotels", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "search_hotels" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
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

    return new Response(JSON.stringify({ hotels: [], summary: "No results found." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("hotels-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
