'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SchedulerDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'scheduler') {
      router.push('/auth/login');
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Scheduler Dashboard 🗓️</h1>
      <p>Welcome, Scheduler! You can manage training schedules here.</p>
    </div>
  );
}
