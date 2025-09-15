'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatisticsChart({ data, onClick, width, height, units = 'units' }) {
  const chartData = {
    labels: data.map((item) => item.day_of_week),
    datasets: [
      {
        label: 'Workout Statistics',
        data: data.map((item) => item.total_training_time),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} ${units}`,
        },
      },
    },
  };

  if (!data || !Array.isArray(data)) return <div>No data available</div>;
  return (
    <div className="container mx-auto px-4 py-8" style={{ width: width, height: height }}>
      <div className="mb-4">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}