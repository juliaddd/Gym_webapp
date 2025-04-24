'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function ChartSection({ data, options }) {
  return (
    <div className="h-1/4 w-4/5">
      <Bar data={data} options={options} />
      <div className="text-center mt-2">
        <button className="text-blue-500 underline hover:text-blue-700">
          See full statistics
        </button>
      </div>
    </div>
  );
}
