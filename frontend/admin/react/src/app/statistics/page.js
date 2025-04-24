'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StatisticsChart from '../components/StatisticsChart';

export default function StatisticsPage() {
  const [allWeeklyData, setAllWeeklyData] = useState([]);
  const [allMonthlyData, setAllMonthlyData] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [currentWeekLabel, setCurrentWeekLabel] = useState('This Week');
  const [currentMonthLabel, setCurrentMonthLabel] = useState('This Month');
  const router = useRouter();

  const mockAllWeeklyData = [
    [
      { day: 'Monday', value: 30 },
      { day: 'Tuesday', value: 40 },
      { day: 'Wednesday', value: 20 },
      { day: 'Thursday', value: 50 },
      { day: 'Friday', value: 60 },
      { day: 'Saturday', value: 55 },
      { day: 'Sunday', value: 70 },
    ],
    [
      { day: 'Monday', value: 25 },
      { day: 'Tuesday', value: 35 },
      { day: 'Wednesday', value: 15 },
      { day: 'Thursday', value: 45 },
      { day: 'Friday', value: 55 },
      { day: 'Saturday', value: 50 },
      { day: 'Sunday', value: 65 },
    ],
    [
      { day: 'Monday', value: 20 },
      { day: 'Tuesday', value: 30 },
      { day: 'Wednesday', value: 10 },
      { day: 'Thursday', value: 40 },
      { day: 'Friday', value: 50 },
      { day: 'Saturday', value: 45 },
      { day: 'Sunday', value: 60 },
    ],
  ];

  const mockAllMonthlyData = [
    [
      { day: 'Week 1', value: 200 },
      { day: 'Week 2', value: 180 },
      { day: 'Week 3', value: 220 },
      { day: 'Week 4', value: 190 },
    ],
    [
      { day: 'Week 1', value: 180 },
      { day: 'Week 2', value: 160 },
      { day: 'Week 3', value: 200 },
      { day: 'Week 4', value: 170 },
    ],
    [
      { day: 'Week 1', value: 160 },
      { day: 'Week 2', value: 140 },
      { day: 'Week 3', value: 180 },
      { day: 'Week 4', value: 150 },
    ],
  ];

  useEffect(() => {
    setAllWeeklyData(mockAllWeeklyData);
    setAllMonthlyData(mockAllMonthlyData);
  }, []);

  const getWeekLabel = (index) => {
    if (index === 0) return 'This Week';
    if (index === 1) return 'Last Week';
    return `${index} Weeks Ago`;
  };

  const getMonthLabel = (index) => {
    if (index === 0) return 'This Month';
    if (index === 1) return 'Last Month';
    return `${index} Months Ago`;
  };

  const handleWeekChange = (direction) => {
    let newIndex = direction === 'previous'
      ? Math.min(currentWeekIndex + 1, allWeeklyData.length - 1)
      : Math.max(currentWeekIndex - 1, 0);
    setCurrentWeekIndex(newIndex);
    setCurrentWeekLabel(getWeekLabel(newIndex));
  };

  const handleMonthChange = (direction) => {
    let newIndex = direction === 'previous'
      ? Math.min(currentMonthIndex + 1, allMonthlyData.length - 1)
      : Math.max(currentMonthIndex - 1, 0);
    setCurrentMonthIndex(newIndex);
    setCurrentMonthLabel(getMonthLabel(newIndex));
  };

  const handleBackClick = () => {
    router.back();
  };

  if (!allWeeklyData.length || !allMonthlyData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4 cursor-pointer" onClick={handleBackClick}>
        <ArrowBackIcon /> <span className="ml-2">Back</span>
      </div>

      <h2 className="text-xl font-bold mb-2">Weekly Statistics</h2>
      <StatisticsChart data={allWeeklyData[currentWeekIndex]} />
      <div className="text-center text-gray-600 mt-2">{currentWeekLabel}</div>
      <div className="flex justify-between my-4">
        <button onClick={() => handleWeekChange('previous')} disabled={currentWeekIndex === allWeeklyData.length - 1}>
          <ArrowBackIosIcon />
        </button>
        <button onClick={() => handleWeekChange('next')} disabled={currentWeekIndex === 0}>
          <ArrowForwardIosIcon />
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Monthly Statistics</h2>
      <StatisticsChart data={allMonthlyData[currentMonthIndex]} />
      <div className="text-center text-gray-600 mt-2">{currentMonthLabel}</div>
      <div className="flex justify-between my-4">
        <button onClick={() => handleMonthChange('previous')} disabled={currentMonthIndex === allMonthlyData.length - 1}>
          <ArrowBackIosIcon />
        </button>
        <button onClick={() => handleMonthChange('next')} disabled={currentMonthIndex === 0}>
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
}

