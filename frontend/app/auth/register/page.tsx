'use client';

import { useState } from 'react';
import { registerUser } from '@/services/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('athlete');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    try {
      const res = await registerUser({ name, email, password, role, phone });
      if (res.data.success) {
        toast.success('Registration Successful!');
        router.push('/auth/login');
      }
    } catch (error: any) {
      toast.error(error.response.data.message || 'Registration Failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 border rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded-md"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-3 border rounded-md"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-3 border rounded-md"
        >
          <option value="athlete">Athlete</option>
          <option value="coach">Coach</option>
          <option value="scheduler">Scheduler</option>
          <option value="manager">Manager</option>
          <option value="planner">Planner</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleRegister} className="w-full bg-blue-600 text-white py-2 rounded-md">
          Register
        </button>
      </div>
    </div>
  );
}
