'use client';

import { useEffect, useState } from 'react';
import { fetchAthletePerformance, analyzePerformance } from '@/services/api';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AthleteStats() {
  const { athleteId } = useParams() as { athleteId: string };

  const [performanceData, setPerformanceData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<string>('');

  const fetchPerformanceData = async () => {
    try {
      const data = await fetchAthletePerformance(athleteId);
      setPerformanceData(data);
    } catch (error) {
      toast.error('Error fetching performance data');
    }
  };

  const handleAnalyzePerformance = async () => {
    try {
      const result = await analyzePerformance(athleteId);
      setAnalysis(result.analysis);
      toast.success('Performance Analysis Done!');
    } catch (error) {
      toast.error('Error analyzing performance');
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Athlete Performance Stats 📈</h1>

      {performanceData ? (
        <div className="mb-6 bg-gray-100 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">🔥 Performance Data:</h2>
          <pre>{JSON.stringify(performanceData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading performance data...</p>
      )}

      <button
        onClick={handleAnalyzePerformance}
        className="bg-blue-600 text-white px-6 py-2 rounded-md"
      >
        Analyze Performance (AI) 🚀
      </button>

      {analysis && (
        <div className="mt-6 p-6 bg-green-100 rounded-md">
          <h3 className="text-lg font-semibold">🔍 AI Performance Analysis:</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}
