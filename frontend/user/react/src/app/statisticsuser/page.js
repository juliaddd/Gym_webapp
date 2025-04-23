'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function StatisticsPage({ onBack, onChangeWeek, onChangeMonth }) {
  const [allWeeklyData, setAllWeeklyData] = useState([]);
  const [allMonthlyData, setAllMonthlyData] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [currentWeekLabel, setCurrentWeekLabel] = useState('This Week');
  const [currentMonthLabel, setCurrentMonthLabel] = useState('This Month');
  const router = useRouter();

  // Mock data for multiple weeks
  const mockAllWeeklyData = [
    // Current week
    [
      { day: 'Monday', value: 30 },
      { day: 'Tuesday', value: 40 },
      { day: 'Wednesday', value: 20 },
      { day: 'Thursday', value: 50 },
      { day: 'Friday', value: 60 },
      { day: 'Saturday', value: 55 },
      { day: 'Sunday', value: 70 },
    ],
    // Previous week
    [
      { day: 'Monday', value: 25 },
      { day: 'Tuesday', value: 35 },
      { day: 'Wednesday', value: 15 },
      { day: 'Thursday', value: 45 },
      { day: 'Friday', value: 55 },
      { day: 'Saturday', value: 50 },
      { day: 'Sunday', value: 65 },
    ],
    // Two weeks ago
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

  // Mock data for multiple months
  const mockAllMonthlyData = [
    // Current month
    [
      { week: 'Week 1', value: 200 },
      { week: 'Week 2', value: 180 },
      { week: 'Week 3', value: 220 },
      { week: 'Week 4', value: 190 },
    ],
    // Previous month
    [
      { week: 'Week 1', value: 180 },
      { week: 'Week 2', value: 160 },
      { week: 'Week 3', value: 200 },
      { week: 'Week 4', value: 170 },
    ],
    // Two months ago
    [
      { week: 'Week 1', value: 160 },
      { week: 'Week 2', value: 140 },
      { week: 'Week 3', value: 180 },
      { week: 'Week 4', value: 150 },
    ],
  ];

  useEffect(() => {
    setAllWeeklyData(mockAllWeeklyData);
    setAllMonthlyData(mockAllMonthlyData);
  }, []);

  // Generate dynamic labels based on index
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

  // Handle week change
  const handleWeekChange = (direction) => {
    let newIndex;
    if (direction === 'previous') {
      // Left arrow: move to previous (older) week, increase index
      newIndex = Math.min(currentWeekIndex + 1, allWeeklyData.length - 1);
    } else {
      // Right arrow: move to next (newer) week, decrease index
      newIndex = Math.max(currentWeekIndex - 1, 0);
    }
    setCurrentWeekIndex(newIndex);
    setCurrentWeekLabel(getWeekLabel(newIndex));
  };

  // Handle month change
  const handleMonthChange = (direction) => {
    let newIndex;
    if (direction === 'previous') {
      // Left arrow: move to previous (older) month, increase index
      newIndex = Math.min(currentMonthIndex + 1, allMonthlyData.length - 1);
    } else {
      // Right arrow: move to next (newer) month, decrease index
      newIndex = Math.max(currentMonthIndex - 1, 0);
    }
    setCurrentMonthIndex(newIndex);
    setCurrentMonthLabel(getMonthLabel(newIndex));
  };

  // Handle back button click
  const handleBackClick = () => {
    router.back();
  };

  // Handle profile click
  const handleProfileClick = () => {
    router.push('/profile');
  };

  if (!allWeeklyData.length || !allMonthlyData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Profile Section */}
      <div className="flex justify-end">
        <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={handleProfileClick} />
      </div>

      {/* Back Button */}
      <div className="back-button" onClick={handleBackClick} style={{ cursor: 'pointer', margin: '10px' }}>
        <ArrowBackIcon />
        <span style={{ marginLeft: '5px' }}>Back</span>
      </div>

      {/* Weekly Statistics Section */}
      <div className="my-8">
        <StatisticsChart data={allWeeklyData[currentWeekIndex]} onClick={onChangeWeek} />
        <div className="text-center mt-4">
          <span>{currentWeekLabel}</span>
        </div>
      </div>

      {/* Navigation Arrows for Week */}
      <div className="flex justify-between mt-4">
        <div
          onClick={() => handleWeekChange('previous')}
          style={{ cursor: currentWeekIndex === allWeeklyData.length - 1 ? 'not-allowed' : 'pointer', margin: '10px', opacity: currentWeekIndex === allWeeklyData.length - 1 ? 0.5 : 1 }}
        >
          <ArrowBackIosIcon />
        </div>
        <div
          onClick={() => handleWeekChange('next')}
          style={{ cursor: currentWeekIndex === 0 ? 'not-allowed' : 'pointer', margin: '10px', opacity: currentWeekIndex === 0 ? 0.5 : 1 }}
        >
          <ArrowForwardIosIcon />
        </div>
      </div>

      {/* Monthly Statistics Section */}
      <div className="my-8">
        <StatisticsChart data={allMonthlyData[currentMonthIndex]} onClick={onChangeMonth} />
        <div className="text-center mt-4">
          <span>{currentMonthLabel}</span>
        </div>
      </div>

      {/* Navigation Arrows for Month */}
      <div className="flex justify-between mt-4">
        <div
          onClick={() => handleMonthChange('previous')}
          style={{ cursor: currentMonthIndex === allMonthlyData.length - 1 ? 'not-allowed' : 'pointer', margin: '10px', opacity: currentMonthIndex === allMonthlyData.length - 1 ? 0.5 : 1 }}
        >
          <ArrowBackIosIcon />
        </div>
        <div
          onClick={() => handleMonthChange('next')}
          style={{ cursor: currentMonthIndex === 0 ? 'not-allowed' : 'pointer', margin: '10px', opacity: currentMonthIndex === 0 ? 0.5 : 1 }}
        >
          <ArrowForwardIosIcon />
        </div>
      </div>
    </div>
  );
}