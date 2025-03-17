'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manager') {
      router.push('/auth/login');
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Manager Dashboard 🏢</h1>
      <p>Welcome, Manager! You can manage athletes and coaches here.</p>
    </div>
  );
}
