'use client';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useRef } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({ data = [] }) {
  const chartRef = useRef(null);

  const total = data.reduce((sum, item) => sum + item.total_training_time, 0);

  const chartData = {
    labels: data.map(item => item.category_name),
    datasets: [
      {
        data: data.map(item => item.total_training_time),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#9966FF',
          '#4BC0C0',
          '#F67019',
          '#00A6B4',
          '#B4FF9F',
          '#E4FF1A',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleClick = (event) => {
    const chart = chartRef.current;
    if (!chart) return;

    const elements = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, true);

    if (elements.length > 0) {
      const index = elements[0].index;
      const clickedCategory = data[index];
      if (onSegmentClick) onSegmentClick(clickedCategory);
    }
  };

  // Custom tooltip to show percentage
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const totalValue = dataset.data.reduce((acc, val) => acc + val, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / totalValue) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}% (${currentValue} min)`;
          }
        }
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Pie data={chartData} ref={chartRef} options={options} />
    </div>
  );
}
