
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { addEvent } from "@/data/events";
import AIEventGenerator from "./AIEventGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventFormProps {
  onEventAdded?: () => void;
}

export default function EventForm({ onEventAdded }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an event.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // First try to save to Supabase
      const { data, error } = await supabase
        .from('events')
        .insert({ 
          title, 
          description, 
          date, 
          location, 
          image: image || null,
          created_by: user.id
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Also add to local data for compatibility
      addEvent({ title, description, date, location, image });
      
      toast({
        title: "Success",
        description: "Event added successfully!"
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setImage("");
      
      if (onEventAdded) {
        onEventAdded();
      }
    } catch (error: any) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add event",
        variant: "destructive"
      });
    }
  };
  
  const handleAIGenerated = (generatedTitle: string, generatedDescription: string) => {
    setTitle(generatedTitle);
    setDescription(generatedDescription);
  };
  
  return (
    <div className="grid gap-6">
      <AIEventGenerator onGenerated={handleAIGenerated} />
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-college-blue">Add New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title*</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Date*</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location*</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter event location"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            
            <Button type="submit" className="w-full bg-college-blue hover:bg-college-lightblue">
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
