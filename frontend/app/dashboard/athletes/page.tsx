'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AthleteDashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'athlete') {
      router.push('/auth/login');
    }
  }, []);

  const athleteId = localStorage.getItem('athleteId'); // ✅ Storing athleteId in localStorage after login

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Athlete Dashboard 🏢</h1>
      <p>Welcome, Athlete! You can manage athletes and coaches here.</p>

      <Link href={`/dashboard/athletes/${athleteId}/profile`}>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">👤 Profile</button>
      </Link>

      <Link href={`/dashboard/athletes/${athleteId}/performance`}>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md">🏅 Performance</button>
      </Link>

      <Link href={`/dashboard/athletes/${athleteId}/injury`}>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md">🩹 Injury Risk</button>
      </Link>

      <Link href={`/dashboard/athletes/${athleteId}/stats`}>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md">📈 Stats</button>
      </Link>
    </div>
  );
}
