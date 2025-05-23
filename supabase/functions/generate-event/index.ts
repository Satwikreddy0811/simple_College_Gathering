
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Fallback generator in case the OpenAI API fails
const generateFallbackContent = (topic: string, department: string, type: string) => {
  const titles = [
    `${type} on ${topic} by ${department}`,
    `${department} presents: ${topic} ${type}`,
    `Discover ${topic}: A ${type} by ${department}`,
    `${topic} Exploration: ${department} ${type}`,
    `Join us for a ${department} ${type} on ${topic}`
  ];
  
  const descriptions = [
    `Join us for this exciting ${type} on ${topic} organized by the ${department} department. This event will provide valuable insights and hands-on experience. Don't miss this opportunity to expand your knowledge and network with others interested in this field.`,
    `The ${department} department is proud to present this ${type} focusing on ${topic}. Whether you're a beginner or advanced, this event will offer something valuable for everyone. Come learn from experts and enhance your skills.`,
    `Explore the fascinating world of ${topic} in this informative ${type} hosted by ${department}. This event features interactive sessions and networking opportunities. Register now to secure your spot!`
  ];
  
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  return {
    title: randomTitle,
    description: randomDesc
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, department, type } = await req.json();
    
    if (!topic || !department || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      // Try OpenAI first
      const prompt = `Generate a catchy title and engaging description for a college event with the following details:
      - Topic: ${topic}
      - Department: ${department}
      - Event Type: ${type}
      
      The title should be creative, concise, and attention-grabbing.
      The description should be around 100-150 words, explaining the event purpose, target audience, and benefits of attending.
      
      Format the response as a JSON object with fields:
      - title: The generated title
      - description: The generated description`;
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a creative college event marketing assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        }),
      });
      
      const data = await response.json();
      
      // Check if there was an OpenAI API error
      if (data.error) {
        console.error("OpenAI API error:", data.error);
        // Use fallback if OpenAI fails
        const fallbackContent = generateFallbackContent(topic, department, type);
        return new Response(
          JSON.stringify(fallbackContent),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Parse OpenAI response
      try {
        const content = data.choices[0].message.content;
        // Try to parse the response as JSON first
        try {
          const parsedJson = JSON.parse(content);
          return new Response(
            JSON.stringify(parsedJson),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        } catch (e) {
          // If can't parse as JSON, extract title and description manually
          const titleMatch = content.match(/title["\s:]+([^\n"]+)/i);
          const descriptionMatch = content.match(/description["\s:]+([^"]+)/is);
          
          const title = titleMatch ? titleMatch[1].trim() : "Event Title";
          const description = descriptionMatch ? descriptionMatch[1].trim() : "Event Description";
          
          return new Response(
            JSON.stringify({ title, description }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      } catch (error) {
        // Use fallback if OpenAI response parsing fails
        console.error("Error parsing OpenAI response:", error);
        const fallbackContent = generateFallbackContent(topic, department, type);
        return new Response(
          JSON.stringify(fallbackContent),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } catch (openAIError) {
      // Use fallback if OpenAI call fails
      console.error("OpenAI API error:", openAIError);
      const fallbackContent = generateFallbackContent(topic, department, type);
      return new Response(
        JSON.stringify(fallbackContent),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in generate-event function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
