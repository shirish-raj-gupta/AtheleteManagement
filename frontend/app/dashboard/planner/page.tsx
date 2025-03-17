'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlannerDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'planner') {
      router.push('/auth/login');
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Planner Dashboard 📅</h1>
      <p>Welcome, Planner! You can plan future events and schedules here.</p>
    </div>
  );
}
