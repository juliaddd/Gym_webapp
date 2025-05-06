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

export default function MonthlyCategoryChart({ data = [] }) {
    const chartData = {
      labels: data.map((item) => item.category_name || item.category),
      datasets: [
        {
          labels: data.map((item) => item.category_name || item.category),
          data: data.map((item) => item.total_time),
          borderColor: '#a3e4d7', // Бирюзовый цвет
          backgroundColor: '#a3e4d7',
          borderWidth: 1,
        },
      ],
    };
  
    return (
      <div className="p-4">
        <Bar data={chartData} />
      </div>
    );
  }