'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AthleteDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'athlete') {
      router.push('/auth/login');
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Athlete Dashboard 🏃‍♂️</h1>
      <p>Welcome, Athlete! You can track your performance here.</p>
    </div>
  );
}
