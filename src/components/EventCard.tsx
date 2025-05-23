
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Event, registerForEvent } from "@/data/events";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
}

export default function EventCard({ event, onRegister }: EventCardProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  
  const handleRegister = () => {
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    registerForEvent(event.id, { name, email });
    
    toast({
      title: "Success!",
      description: `You're registered for ${event.title}!`
    });
    
    setName("");
    setEmail("");
    setOpen(false);
    
    if (onRegister) {
      onRegister();
    }
  };

  const formattedDate = () => {
    try {
      return format(new Date(event.date), "MMMM d, yyyy");
    } catch (error) {
      return event.date;
    }
  };

  return (
    <Card className="event-card overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {event.image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-college-blue">{event.title}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          <span className="block">{formattedDate()}</span>
          <span className="block">{event.location}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-700">{event.description}</p>
      </CardContent>
      
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-college-blue hover:bg-college-lightblue text-white">Register</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register for {event.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleRegister}>Submit Registration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
