
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { getEvents } from "@/data/events";

const Index = () => {
  const featuredEvents = getEvents().slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-college-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">College Event Management</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
              Discover, register, and manage campus events all in one place
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-college-gold text-college-blue hover:bg-yellow-400">
                <Link to="/events">Browse Events</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-college-blue">
                <Link to="/admin">Admin Access</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Events */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Featured Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-college-blue">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.date}</p>
                    <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                    <Button asChild className="w-full bg-college-blue hover:bg-college-lightblue">
                      <Link to="/events">View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-college-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Browse Events</h3>
                <p className="text-gray-600">
                  Explore upcoming campus events and find activities that interest you.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-college-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Register Online</h3>
                <p className="text-gray-600">
                  Sign up for events with our simple registration process.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-college-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Attend & Enjoy</h3>
                <p className="text-gray-600">
                  Get confirmation and reminders about your registered events.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-college-blue text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} College Events Management</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
