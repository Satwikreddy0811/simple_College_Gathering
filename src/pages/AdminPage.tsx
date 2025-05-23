
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEvents, Event } from "@/data/events";
import Header from "@/components/Header";
import EventForm from "@/components/EventForm";
import ParticipantsList from "@/components/ParticipantsList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [events, setEvents] = useState(getEvents());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(
    events.length > 0 ? events[0] : null
  );
  
  const refreshEvents = () => {
    const updatedEvents = getEvents();
    setEvents(updatedEvents);
    
    // Update selected event if it exists in the new list
    if (selectedEvent) {
      const updatedEvent = updatedEvents.find(e => e.id === selectedEvent.id);
      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      } else if (updatedEvents.length > 0) {
        setSelectedEvent(updatedEvents[0]);
      } else {
        setSelectedEvent(null);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-center mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="events" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="add-event">Add New Event</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 shadow-md">
                <CardHeader>
                  <CardTitle>Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    {events.length === 0 ? (
                      <p className="text-muted-foreground">No events available.</p>
                    ) : (
                      events.map((event) => (
                        <Button
                          key={event.id}
                          variant={selectedEvent?.id === event.id ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setSelectedEvent(event)}
                        >
                          {event.title}
                        </Button>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="md:col-span-2">
                {selectedEvent ? (
                  <ParticipantsList event={selectedEvent} />
                ) : (
                  <Card className="shadow-md">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">
                        Select an event to view its participants
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="add-event" className="mt-6">
            <EventForm onEventAdded={refreshEvents} />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-college-blue text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} College Events Management</p>
        </div>
      </footer>
    </div>
  );
}
