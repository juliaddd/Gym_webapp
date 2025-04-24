// StatisticsChart.js
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatisticsChart({ data }) {
  const chartData = {
    labels: data.map(item => item.day || item.week),
    datasets: [
      {
        label: 'Workout Statistics',
        data: data.map(item => item.value),
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} units`,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

