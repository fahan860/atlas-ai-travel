import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a specialized Itinerary Planner Agent for Morocco travel. You create detailed day-by-day trip itineraries.

Create realistic itineraries with:
- Morning, afternoon, and evening activities for each day
- Specific restaurant and café recommendations
- Travel logistics between cities (trains, buses, private transfers with estimated costs)
- Estimated costs per activity in USD
- Cultural tips and etiquette notes
- Mix of popular attractions and hidden gems
- Realistic pacing (not too rushed)

Key Morocco knowledge for planning:
- Marrakech to Fes: ~6hrs by train or 1hr flight
- Marrakech to Essaouira: ~3hrs by bus
- Fes to Chefchaouen: ~4hrs by bus
- Merzouga desert camps require full-day travel from most cities
- Friday is prayer day, some shops close midday
- Ramadan affects restaurant hours

Return structured data using the create_itinerary tool.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, days, budget, interests, startDate } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Create a ${days || 7}-day itinerary for ${destination || "Morocco"} starting ${startDate || "soon"}. Budget: $${budget || 2000}. Interests: ${interests || "culture, food, sightseeing"}. Return using the create_itinerary tool.`;

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
              name: "create_itinerary",
              description: "Return a day-by-day itinerary",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  destination: { type: "string" },
                  totalDays: { type: "number" },
                  estimatedBudget: { type: "number" },
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "number" },
                        title: { type: "string" },
                        location: { type: "string" },
                        activities: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              time: { type: "string" },
                              activity: { type: "string" },
                              description: { type: "string" },
                              estimatedCost: { type: "number" },
                              tip: { type: "string" },
                            },
                            required: ["time", "activity", "description", "estimatedCost"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["day", "title", "location", "activities"],
                      additionalProperties: false,
                    },
                  },
                  packingList: { type: "array", items: { type: "string" } },
                  summary: { type: "string" },
                },
                required: ["title", "destination", "totalDays", "estimatedBudget", "days", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_itinerary" } },
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

    return new Response(JSON.stringify({ error: "Could not generate itinerary." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("itinerary-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
