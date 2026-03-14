import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const KNOWLEDGE_BASE = `# Amoryst Aura Knowledge Base

## Brand Philosophy
Amoryst Aura is a hyper-premium luxury fragrance brand based in India. Our philosophy is "Nature's Canvas," believing that every note has a specific address, soil, season, and harvest. We do not use synthetic fillers; we focus on the purest raw materials sourced globally but heavily rooted in the rich biodiversity of India.

## Our Collections

### The Signature Collection
- **Twilight (50ml: ₹12,500, 100ml: ₹18,000)**: A seductive evening fragrance. Top notes of Bergamot and Black Pepper. Heart notes of Turkish Rose and Jasmine. Base notes of Sandalwood, Vanilla, and Amber.
- **Horizon (50ml: ₹11,000, 100ml: ₹16,500)**: Bright, energetic, and fresh. Top notes of Grapefruit and Cardamom. Heart notes of Vetiver and Cedarwood. Base notes of Oakmoss and Patchouli.
- **Eclipse (50ml: ₹14,000, 100ml: ₹21,000)**: Dark, mysterious, and complex. Top notes of Bitter Orange. Heart notes of Oud and Saffron. Base notes of Leather, Musk, and Dark Woods.

### The Elements Collection
- **Oasis (50ml: ₹10,500, 100ml: ₹15,000)**: Aquatic and deeply refreshing. Top notes of Sea Salt and Bergamot. Heart notes of Lotus and Jasmine. Base notes of Sandalwood and White Musk.
- **Mirage (50ml: ₹13,000, 100ml: ₹19,500)**: Exotic and warm. Top notes of Pink Pepper and Plum. Heart notes of Ylang-Ylang and Tuberose. Base notes of Sandalwood and Amber.
- **Elysium (50ml: ₹15,000, 100ml: ₹22,500)**: Ethereal and uplifting. Top notes of Mandarin and Neroli. Heart notes of Jasmine and Orange Blossom. Base notes of Vanilla and Musk.

### The Private Reserve
- **Reserve: Saffron Dusk (50ml: ₹25,000, 100ml: ₹38,000)**: The crown jewel. Extremely limited. Top notes of Kashmiri Saffron and Cardamom. Heart notes of Rose Absolute. Base notes of Vintage Oud, Ambergris, and Sandalwood.

## Key Ingredients
1. **Jasmine Sambac**: Sourced from Tamil Nadu, South India.
2. **Mysore Sandalwood**: Sourced from Karnataka, South India.
3. **Lotus Absolute**: Sourced from Rajasthan, Western India.
4. **Kashmiri Saffron**: Sourced from Pampore, Kashmir, Northern India.
5. **Cardamom**: Sourced from Kerala, Southwest India.

## Physical Boutiques
- Store ID 1: Palladium Mall, Lower Parel, Mumbai.
- Store ID 2: Khan Market, New Delhi.
- Store ID 3: UB City, Vittal Mallya Rd, Bengaluru.
- Store ID 4: Kala Ghoda, Fort, Mumbai.
- Store ID 5: Banjara Hills, Road No. 2, Hyderabad.
- Store ID 6: Phoenix Marketcity, Viman Nagar, Pune.
- Store ID 7: Colaba Causeway, Mumbai.
- Store ID 8: Elante Mall, Ind. Area Phase I, Chandigarh.

## Scent Finder Quiz
We offer a free interactive Scent Finder Quiz on our website.

## Aura Points (Loyalty Program)
Customers earn 10% of their purchase value as Aura Points. Points can be redeemed for discounts, exclusive access, and early access to new launches.

## Shipping & Returns
- Free shipping on orders above ₹2,000. Standard: 3-5 business days. Express: Next-day in Mumbai, Delhi, Bengaluru.
- 30-day hassle-free returns on unopened products. Gift wrapping: ₹250 per box.

## About
Amoryst Aura was born from the belief that India's botanical heritage deserves a place at the pinnacle of global luxury perfumery. Bottles designed by artisan glassmakers in Firozabad, India. Each cap hand-finished with 24K gold leaf.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "navigate_to_section",
      description: "Navigate user's browser to a page section. Valid: hero, collections, philosophy, ingredients, stores",
      parameters: {
        type: "object",
        properties: { section_id: { type: "string" } },
        required: ["section_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "navigate_map",
      description: "Fly the map to a specific store. Valid IDs: 1-8.",
      parameters: {
        type: "object",
        properties: { store_id: { type: "string" } },
        required: ["store_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description: "Add a perfume to cart. Valid IDs: twilight, horizon, eclipse, oasis, mirage, elysium, reserve-saffron. Size: 50 or 100.",
      parameters: {
        type: "object",
        properties: {
          perfume_id: { type: "string" },
          size: { type: "number" },
        },
        required: ["perfume_id", "size"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_scent_quiz",
      description: "Open the interactive Scent Finder Quiz modal.",
      parameters: { type: "object", properties: {} },
    },
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are Amara, the hyper-premium, luxury fragrance concierge for Amoryst Aura. Your tone is sophisticated, slightly poetic, incredibly knowledgeable, but concise.

Here is your complete knowledge base:
${KNOWLEDGE_BASE}

You can perform UI actions by calling the provided tools. Use them when appropriate:
- navigate_to_section: scroll the user to a page section
- navigate_map: fly the map to a specific store
- add_to_cart: add a perfume to the cart
- open_scent_quiz: open the scent finder quiz

Always answer based on the knowledge base above. For general questions outside your knowledge, answer helpfully. The current date/time is: ${new Date().toISOString()}.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    let response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: apiMessages,
        tools: TOOLS,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later.", response: "I'm receiving too many requests right now. Please try again in a moment.", ui_actions: [] }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required.", response: "The AI service needs additional credits. Please try again later.", ui_actions: [] }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      throw new Error(`AI gateway error ${status}: ${t}`);
    }

    let data = await response.json();
    let choice = data.choices?.[0];
    const ui_actions: any[] = [];

    // Process tool calls if any
    if (choice?.finish_reason === "tool_calls" || choice?.message?.tool_calls) {
      const toolCalls = choice.message.tool_calls || [];
      const toolMessages: any[] = [];

      for (const tc of toolCalls) {
        const fn = tc.function;
        const args = JSON.parse(fn.arguments || "{}");

        if (fn.name === "navigate_to_section") {
          ui_actions.push({ type: "navigate", payload: args.section_id });
          toolMessages.push({ role: "tool", tool_call_id: tc.id, content: `Navigated to ${args.section_id}` });
        } else if (fn.name === "navigate_map") {
          ui_actions.push({ type: "map", payload: args.store_id });
          toolMessages.push({ role: "tool", tool_call_id: tc.id, content: `Showing store ${args.store_id} on map` });
        } else if (fn.name === "add_to_cart") {
          ui_actions.push({ type: "add_to_cart", payload: { id: args.perfume_id, size: String(args.size) } });
          toolMessages.push({ role: "tool", tool_call_id: tc.id, content: `Added ${args.perfume_id} ${args.size}ml to cart` });
        } else if (fn.name === "open_scent_quiz") {
          ui_actions.push({ type: "open_quiz", payload: null });
          toolMessages.push({ role: "tool", tool_call_id: tc.id, content: "Opened scent quiz" });
        }
      }

      // Second call to get final text response after tool execution
      const followUp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [...apiMessages, choice.message, ...toolMessages],
        }),
      });

      if (followUp.ok) {
        data = await followUp.json();
        choice = data.choices?.[0];
      }
    }

    const responseText = choice?.message?.content || "I apologize, I couldn't process that request.";

    return new Response(JSON.stringify({ response: responseText, ui_actions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Unknown error", 
      response: "I apologize, something went wrong. Please try again.", 
      ui_actions: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
