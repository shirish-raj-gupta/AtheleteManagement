'use client';

import { useEffect, useState } from 'react';
import { fetchEvents, registerForEvent } from '@/services/api';
import { toast } from 'react-toastify';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  const fetchAllEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent(eventId);
      toast.success('Registered successfully');
    } catch (error) {
      toast.error('Error registering for event');
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Events</h1>
      {events.map(event => (
        <div key={event.id} className="mb-4 p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p>Date: {event.date}</p>
          <p>Location: {event.location}</p>
          <button onClick={() => handleRegister(event.id)} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md">
            Register
          </button>
        </div>
      ))}
    </div>
  );
}
