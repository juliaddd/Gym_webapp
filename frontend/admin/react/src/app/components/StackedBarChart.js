// Обновленный компонент StackedBarChart (пример):
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Регистрируем необходимые элементы для Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StackedBarChart({ data }) {
  // Переводим данные в формат для Chart.js
  const categories = [];
  const basicData = [];
  const premiumData = [];
  const vipData = [];

  data.forEach(item => {
    categories.push(item.category_name);
    // Группируем данные по типам подписок
    if (item.subscription_type === 'basic') {
      basicData.push(item.total_time);
    } else if (item.subscription_type === 'premium') {
      premiumData.push(item.total_time);
    } else if (item.subscription_type === 'vip') {
      vipData.push(item.total_time);
    }
  });

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Basic',
        data: basicData,
        backgroundColor: 'rgba(100, 255, 255, 0.7)', // Цвет для Basic
      },
      {
        label: 'Premium',
        data: premiumData,
        backgroundColor: 'rgba(255, 165, 0, 0.7)', // Цвет для Premium
      },
      {
        label: 'VIP',
        data: vipData,
        backgroundColor: 'rgba(128, 0, 128, 0.7)', // Цвет для VIP
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: tooltipItem => `${tooltipItem.raw} hours`, // Отображаем количество часов
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
