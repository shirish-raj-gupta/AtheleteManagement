'use client';

import { useEffect, useState } from 'react';
import { getAllAthletes, deleteAthlete } from '@/services/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [athletes, setAthletes] = useState<any[]>([]);

  // ✅ Check token and role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      router.push('/auth/login');
    }

    const allowedRoles = ['athlete', 'coach', 'scheduler', 'manager', 'planner', 'admin'];

    if (!allowedRoles.includes(role as string)) {
      router.push('/auth/login');
    }
  }, []);

  const fetchAthletes = async () => {
    try {
      const data = await getAllAthletes();
      setAthletes(data);
    } catch (error) {
      toast.error('Failed to fetch athletes');
    }
  };

  const handleDelete = async (athleteId: string) => {
    try {
      await deleteAthlete(athleteId);
      toast.success('Athlete Deleted');
      fetchAthletes(); // Refresh List
    } catch (error) {
      toast.error('Error deleting athlete');
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard - All Athletes</h1>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3">ID</th>
            <th className="border p-3">Name</th>
            <th className="border p-3">Sport</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete) => (
            <tr key={athlete.id}>
              <td className="border p-3">{athlete.id}</td>
              <td className="border p-3">{athlete.name}</td>
              <td className="border p-3">{athlete.sport}</td>
              <td className="border p-3">
                <button onClick={() => handleDelete(athlete.id)} className="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
                <a href={`/dashboard/athlete/${athlete.id}/performance`} className="ml-4 bg-blue-600 text-white px-3 py-1 rounded-md">View Performance</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
