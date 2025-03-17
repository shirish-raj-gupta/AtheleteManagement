'use client';

import { useEffect, useState } from 'react';
import { predictInjury } from '@/services/api';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function InjuryPrediction() {
  const { athleteId } = useParams() as { athleteId: string };

  const [injuryRisk, setInjuryRisk] = useState<string | null>(null);

  const handlePredictInjury = async () => {
    try {
      const res = await predictInjury(athleteId);
      setInjuryRisk(res.injuryRisk);
      toast.success('Injury Prediction Done ✅');
    } catch (error) {
      toast.error('Error predicting injury');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Injury Prediction ⚡️</h1>

      <button
        onClick={handlePredictInjury}
        className="bg-red-600 text-white px-4 py-2 rounded-md mb-4"
      >
        Predict Injury Risk 🔥
      </button>

      {injuryRisk && (
        <div className="bg-yellow-100 p-6 rounded-md mt-4">
          <h2 className="text-xl font-semibold">🩹 Injury Risk:</h2>
          <p className="mt-2">{injuryRisk}</p>
        </div>
      )}
    </div>
  );
}
