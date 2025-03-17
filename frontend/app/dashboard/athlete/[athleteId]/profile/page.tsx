'use client';

import { useEffect, useState } from 'react';
import { fetchAthleteProfile, updateAthlete } from '@/services/api';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AthleteProfile() {
  const { athleteId } = useParams() as { athleteId: string };

  const [athleteData, setAthleteData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔥 Fetch Athlete Profile
  const fetchProfileData = async () => {
    try {
      const data = await fetchAthleteProfile(athleteId);
      setAthleteData(data);
    } catch (error) {
      toast.error('Error fetching athlete profile');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Update Profile
  const handleUpdate = async () => {
    try {
      await updateAthlete(athleteId, athleteData);
      toast.success('Profile Updated Successfully ✅');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  // ✅ Fetch Profile on Page Load
  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Athlete Profile 👤</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={athleteData?.name || ''}
            onChange={(e) => setAthleteData({ ...athleteData, name: e.target.value })}
            className="w-full p-3 border rounded-md"
            placeholder="Name"
          />
          <input
            type="text"
            value={athleteData?.email || ''}
            className="w-full p-3 border rounded-md"
            readOnly
          />
          <input
            type="text"
            value={athleteData?.sport || ''}
            onChange={(e) => setAthleteData({ ...athleteData, sport: e.target.value })}
            className="w-full p-3 border rounded-md"
            placeholder="Sport"
          />
          <input
            type="text"
            value={athleteData?.team || ''}
            onChange={(e) => setAthleteData({ ...athleteData, team: e.target.value })}
            className="w-full p-3 border rounded-md"
            placeholder="Team"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Update Profile ✅
          </button>
        </div>
      )}
    </div>
  );
}
