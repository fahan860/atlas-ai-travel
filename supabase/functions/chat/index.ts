import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are AtlasTrip AI, a friendly and knowledgeable travel assistant specializing in Morocco. You help users plan trips, find flights, hotels, and create detailed itineraries.

You have access to specialized tools:
- **search_flights**: Search for flights to Morocco with pricing
- **search_hotels**: Find hotels, riads and accommodations
- **get_weather**: Get weather info and best-time-to-visit recommendations
- **create_itinerary**: Generate detailed day-by-day trip itineraries

When users ask about flights, hotels, weather, or itineraries, USE THE APPROPRIATE TOOL to provide structured data. For general questions, respond directly.

Always be enthusiastic about Morocco travel. Use markdown formatting. Include emoji for visual appeal.

Key Morocco knowledge:
- Imperial Cities: Marrakech, Fes, Meknes, Rabat
- Best beaches: Essaouira, Agadir, Taghazout
- Blue City: Chefchaouen
- Desert: Merzouga, Zagora for Sahara experiences
- Mountains: Atlas Mountains, Toubkal
- Currency: Moroccan Dirham (MAD), ~10 MAD = 1 USD
- Languages: Arabic, Amazigh, French widely spoken`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "search_flights",
      description: "Search for flights to Moroccan destinations. Use when users ask about flights or airfare.",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string", description: "Departure city" },
          to: { type: "string", description: "Arrival city in Morocco" },
          date: { type: "string", description: "Travel date" },
          passengers: { type: "number", description: "Number of passengers" },
          budget: { type: "string", description: "Budget preference" },
        },
        required: ["to"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_hotels",
      description: "Search for hotels, riads and accommodations. Use when users ask about places to stay.",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "City or area" },
          checkIn: { type: "string" },
          checkOut: { type: "string" },
          guests: { type: "number" },
          budget: { type: "string" },
          type: { type: "string", description: "riad, hotel, camp, etc." },
        },
        required: ["location"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get weather and best-time-to-visit info for Morocco. Use when users ask about weather or when to go.",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string" },
          month: { type: "string" },
        },
        required: ["location"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_itinerary",
      description: "Create a detailed day-by-day trip itinerary. Use when users want trip planning.",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string" },
          days: { type: "number" },
          budget: { type: "number" },
          interests: { type: "string" },
          startDate: { type: "string" },
        },
        required: ["destination"],
        additionalProperties: false,
      },
    },
  },
];

// Call a sub-agent edge function
async function callSubAgent(functionName: string, params: Record<string, unknown>, apiKey: string): Promise<unknown> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const resp = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify(params),
  });

  return resp.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // First call: let model decide if it needs tools
    const firstResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        tools: TOOLS,
        stream: false,
      }),
    });

    if (!firstResponse.ok) {
      if (firstResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (firstResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in your workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await firstResponse.text();
      console.error("AI gateway error:", firstResponse.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstData = await firstResponse.json();
    const choice = firstData.choices?.[0]?.message;

    // If no tool calls, stream the response directly
    if (!choice?.tool_calls || choice.tool_calls.length === 0) {
      // Re-do as streaming for nice UX
      const streamResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          stream: true,
        }),
      });

      return new Response(streamResp.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Handle tool calls by delegating to sub-agents
    const AGENT_MAP: Record<string, string> = {
      search_flights: "flights-agent",
      search_hotels: "hotels-agent",
      get_weather: "weather-agent",
      create_itinerary: "itinerary-agent",
    };

    const toolResults = [];
    for (const tc of choice.tool_calls) {
      const agentName = AGENT_MAP[tc.function.name];
      if (!agentName) continue;
      const params = JSON.parse(tc.function.arguments);
      const result = await callSubAgent(agentName, params, LOVABLE_API_KEY);
      toolResults.push({
        role: "tool",
        tool_call_id: tc.id,
        content: JSON.stringify(result),
      });
    }

    // Second call: stream the final response with tool results
    const finalResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
          choice,
          ...toolResults,
        ],
        stream: true,
      }),
    });

    if (!finalResp.ok) {
      const t = await finalResp.text();
      console.error("Final stream error:", finalResp.status, t);
      return new Response(JSON.stringify({ error: "AI service error during tool response." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(finalResp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
