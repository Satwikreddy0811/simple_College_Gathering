
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AIEventGeneratorProps {
  onGenerated?: (title: string, description: string) => void;
}

export default function AIEventGenerator({ onGenerated }: AIEventGeneratorProps) {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [department, setDepartment] = useState("");
  const [eventType, setEventType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      toast.error("You must be logged in to use this feature");
      return;
    }
    
    if (!topic || !department || !eventType) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-event", {
        body: { topic, department, type: eventType },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.title && data?.description) {
        if (onGenerated) {
          onGenerated(data.title, data.description);
        }
        toast.success("Event content generated successfully!");
      } else {
        throw new Error("Failed to generate content");
      }
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Using fallback content instead.");
      
      // Provide a simple fallback in the frontend as well
      if (onGenerated) {
        const fallbackTitle = `${eventType} on ${topic} by ${department}`;
        const fallbackDescription = `Join us for this exciting ${eventType} on ${topic} organized by the ${department} department. This event will provide valuable insights and hands-on experience.`;
        onGenerated(fallbackTitle, fallbackDescription);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-college-gold" />
          AI Event Generator
        </CardTitle>
        <CardDescription>
          Generate a catchy title and description for your event using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="topic">Event Topic</Label>
          <Input
            id="topic"
            placeholder="AI Workshop, Career Fair, Hackathon..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="CSE, ECE, Business School..."
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        
        <div>
          <Label htmlFor="eventType">Event Type</Label>
          <Input
            id="eventType"
            placeholder="Workshop, Seminar, Competition..."
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            disabled={isGenerating}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating || !topic || !department || !eventType}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
