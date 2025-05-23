
export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  participants: Participant[];
}

// Sample events data for local development
export const eventsData: Event[] = [
  {
    id: "1",
    title: "Tech Fest 2025",
    description: "A college-wide technology event featuring workshops, competitions, and guest speakers from leading tech companies.",
    date: "2025-06-01",
    location: "Main Campus, Building A",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400&q=80",
    participants: []
  },
  {
    id: "2",
    title: "Annual Cultural Night",
    description: "Join us for a night of music, dance, and cultural performances showcasing student talents from around the world.",
    date: "2025-05-15",
    location: "Student Center Auditorium",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=400&q=80",
    participants: []
  },
  {
    id: "3",
    title: "Career Fair",
    description: "Connect with potential employers from various industries. Bring your resume and dress professionally.",
    date: "2025-07-10",
    location: "Business School, Floor 2",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400&q=80",
    participants: []
  }
];

// Functions to manipulate events data
export const getEvents = () => eventsData;

export const getEvent = (id: string) => {
  return eventsData.find(event => event.id === id);
};

export const addEvent = (event: Omit<Event, 'id' | 'participants'>) => {
  const newEvent = {
    ...event,
    id: (eventsData.length + 1).toString(),
    participants: []
  };
  eventsData.push(newEvent);
  return newEvent;
};

export const registerForEvent = (eventId: string, participant: Omit<Participant, 'id'>) => {
  const event = getEvent(eventId);
  if (!event) return false;
  
  const newParticipant = {
    ...participant,
    id: (event.participants.length + 1).toString()
  };
  
  event.participants.push(newParticipant);
  return true;
};
