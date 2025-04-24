'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';

// Регистрируем необходимые элементы для Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatisticsChart({ data, onClick }) {
  // Преобразование данных в формат, подходящий для Chart.js
  const chartData = {
    labels: data.map((item) => item.day_of_week), // Дни недели
    datasets: [
      {
        label: 'Workout Statistics',
        data: data.map((item) => item.total_training_time), // Значения статистики
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Опции графика для настройки отображения
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} units`, // Форматируем всплывающие подсказки
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Отображаем график */}
      <div className="mb-4">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
