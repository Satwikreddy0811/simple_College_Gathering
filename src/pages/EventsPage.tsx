
import { useState } from "react";
import { getEvents } from "@/data/events";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";

export default function EventsPage() {
  const [events, setEvents] = useState(getEvents());
  const [searchTerm, setSearchTerm] = useState("");
  
  const refreshEvents = () => {
    setEvents([...getEvents()]);
  };
  
  const filteredEvents = events.filter(
    (event) => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-center mb-2">Upcoming Events</h1>
          <p className="text-center text-gray-600 mb-6">
            Discover and register for exciting college events
          </p>
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No events found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRegister={refreshEvents}
              />
            ))}
          </div>
        )}
      </main>
      <footer className="bg-college-blue text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} College Events Management</p>
        </div>
      </footer>
    </div>
  );
}
