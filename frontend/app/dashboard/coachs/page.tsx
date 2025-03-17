'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CoachDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'coach') {
      router.push('/auth/login');
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Coach Dashboard 🏋️‍♂️</h1>
      <p>Welcome, Coach! You can manage your athletes here.</p>
    </div>
  );
}
