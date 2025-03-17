'use client';

import { useEffect, useState } from 'react';
import { fetchAthletePerformance, analyzePerformance, predictInjury } from '@/services/api';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function PerformancePage() {
  const { athleteId } = useParams() as { athleteId: string };

  const [performance, setPerformance] = useState<any>(null);
  const [analysis, setAnalysis] = useState('');
  const [injuryRisk, setInjuryRisk] = useState('');

  const fetchPerformanceData = async () => {
    try {
      const data = await fetchAthletePerformance(athleteId);
      setPerformance(data);
    } catch (error) {
      toast.error('Error fetching performance data');
    }
  };

  const handleAnalyzePerformance = async () => {
    try {
      const res = await analyzePerformance(athleteId);
      setAnalysis(res.analysis);
      toast.success('AI Performance Analysis Done ✅');
    } catch (error) {
      toast.error('Error analyzing performance');
    }
  };

  const handlePredictInjury = async () => {
    try {
      const res = await predictInjury(athleteId);
      setInjuryRisk(res.injuryRisk);
      toast.success('Injury Prediction Done ✅');
    } catch (error) {
      toast.error('Error predicting injury');
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Athlete Performance Analysis 🏅</h1>

      {performance ? (
        <div className="bg-gray-100 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Performance Data:</h2>
          <pre>{JSON.stringify(performance, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading performance data...</p>
      )}

      <div className="flex space-x-4 mt-6">
        <button onClick={handleAnalyzePerformance} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Analyze Performance (AI) ✅
        </button>

        <button onClick={handlePredictInjury} className="bg-red-600 text-white px-4 py-2 rounded-md">
          Predict Injury (AI) ✅
        </button>
      </div>

      {analysis && (
        <div className="mt-6 p-4 bg-green-100 rounded-md">
          <h3 className="text-lg font-semibold">🔍 AI Performance Analysis:</h3>
          <p>{analysis}</p>
        </div>
      )}

      {injuryRisk && (
        <div className="mt-6 p-4 bg-yellow-100 rounded-md">
          <h3 className="text-lg font-semibold">⚠️ Injury Prediction:</h3>
          <p>{injuryRisk}</p>
        </div>
      )}
    </div>
  );
}
