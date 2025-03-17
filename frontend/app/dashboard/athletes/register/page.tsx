'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { registerAthlete } from '@/services/api'; // API call

export default function RegisterAthlete() {
  const [athlete, setAthlete] = useState({
    name: '',
    email: '',
    sport: '',
    team: '',
    age: '',
    gender: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAthlete({ ...athlete, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!athlete.name || !athlete.email || !athlete.sport || !athlete.age || !athlete.gender) {
      toast.error('All fields are required');
      return;
    }

    try {
      await registerAthlete(athlete);
      toast.success('Athlete Registered Successfully ✅');
      
      setAthlete({ name: '', email: '', sport: '', team: '', age: '', gender: '' });
    } catch (error) {
      toast.error('Failed to register athlete ❌');
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏆 Register Athlete</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={athlete.name}
          onChange={handleChange}
          placeholder="Athlete Name"
          className="w-full p-3 border rounded-md"
        />
        <input
          type="email"
          name="email"
          value={athlete.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded-md"
        />
        <input
          type="text"
          name="sport"
          value={athlete.sport}
          onChange={handleChange}
          placeholder="Sport"
          className="w-full p-3 border rounded-md"
        />
        <input
          type="text"
          name="team"
          value={athlete.team}
          onChange={handleChange}
          placeholder="Team"
          className="w-full p-3 border rounded-md"
        />
        <input
          type="number"
          name="age"
          value={athlete.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full p-3 border rounded-md"
        />
        <select
          name="gender"
          value={athlete.gender}
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
          Register ✅
        </button>
      </form>
    </div>
  );
}
