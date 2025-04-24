'use client';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useRouter } from 'next/navigation';

export default function ChartSection({ data, options }) {
  const router = useRouter();

  return (
    <div className="h-1/4 w-4/5">
      <Bar data={data} options={options} />
      <div className="text-center mt-2">
        <button
          className="text-blue-500 underline hover:text-blue-700"
          onClick={() => router.push('/statistics')}
        >
          See full statistics
        </button>
      </div>
    </div>
  );
}
