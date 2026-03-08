import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a specialized Weather & Best-Time-to-Visit Agent for Morocco travel. You provide weather forecasts, climate information, and seasonal travel recommendations.

Use accurate Morocco climate knowledge:
- Marrakech: Hot summers (40°C+), mild winters (18°C). Best: March-May, Sept-Nov
- Fes: Hot dry summers, cold wet winters. Best: April-May, Sept-Oct
- Chefchaouen: Mediterranean climate, cool winters. Best: April-June, Sept-Oct
- Sahara/Merzouga: Extreme heat in summer (50°C+), cold nights in winter. Best: Oct-April
- Essaouira/Coast: Mild year-round (18-25°C), windy. Good anytime, best May-Sept
- Atlas Mountains: Snow in winter, pleasant summers. Best for trekking: June-Sept
- Agadir: Sunny 300+ days/year, 20-30°C. Great year-round

Return structured data using the get_weather tool.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, month } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Provide weather and travel recommendations for "${location || "Morocco"}" ${month ? `in ${month}` : "across all seasons"}. Return results using the get_weather tool.`;

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
              name: "get_weather",
              description: "Return weather and travel season info",
              parameters: {
                type: "object",
                properties: {
                  location: { type: "string" },
                  current: {
                    type: "object",
                    properties: {
                      tempHigh: { type: "number" },
                      tempLow: { type: "number" },
                      condition: { type: "string" },
                      humidity: { type: "number" },
                      rainfall: { type: "string" },
                    },
                    required: ["tempHigh", "tempLow", "condition", "humidity", "rainfall"],
                    additionalProperties: false,
                  },
                  bestMonths: { type: "array", items: { type: "string" } },
                  avoidMonths: { type: "array", items: { type: "string" } },
                  packingTips: { type: "array", items: { type: "string" } },
                  summary: { type: "string" },
                },
                required: ["location", "current", "bestMonths", "avoidMonths", "packingTips", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "get_weather" } },
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

    return new Response(JSON.stringify({ error: "No weather data available." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("weather-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
