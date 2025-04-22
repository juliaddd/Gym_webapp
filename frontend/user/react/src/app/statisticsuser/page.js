'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // The back icon from Material UI

export default function StatisticsPage({ onBack, onChangeWeek, onChangeMonth }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentWeek, setCurrentWeek] = useState({});
  const [currentMonth, setCurrentMonth] = useState({});
  const [currentWeekLabel, setCurrentWeekLabel] = useState('This week');
  const [currentMonthLabel, setCurrentMonthLabel] = useState('This month');
  const router = useRouter();

  const mockWeeklyData = [
    { day: 'Monday', value: 30 },
    { day: 'Tuesday', value: 40 },
    { day: 'Wednesday', value: 20 },
    { day: 'Thursday', value: 50 },
    { day: 'Friday', value: 60 },
    { day: 'Saturday', value: 55 },
    { day: 'Sunday', value: 70 },
  ];

  const mockMonthlyData = [
    { month: 'January', value: 200 },
    { month: 'February', value: 180 },
    { month: 'March', value: 220 },
  ];

  useEffect(() => {
    setWeeklyData(mockWeeklyData);
    setMonthlyData(mockMonthlyData);
    setCurrentWeek(mockWeeklyData[1]);
    setCurrentMonth(mockMonthlyData[1]);
  }, []);

  if (!weeklyData.length || !monthlyData.length) {
    return <div>Loading...</div>;
  }

  // Handle back button click
  const handleBackClick = () => {
    router.back();
  };

  // Handle profile click (redirect to profile page)
  const handleProfileClick = () => {
    router.push('/profile');
  };

  // Handle week change
  const handleWeekChange = (direction) => {
    const currentIndex = mockWeeklyData.indexOf(currentWeek);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < mockWeeklyData.length) {
      setCurrentWeek(mockWeeklyData[newIndex]);
      setCurrentWeekLabel(mockWeeklyData[newIndex].day);
    }
  };

  // Handle month change
  const handleMonthChange = (direction) => {
    const currentIndex = mockMonthlyData.indexOf(currentMonth);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < mockMonthlyData.length) {
      setCurrentMonth(mockMonthlyData[newIndex]);
      setCurrentMonthLabel(mockMonthlyData[newIndex].month);
    }
  };

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
        <StatisticsChart data={weeklyData} onClick={onChangeWeek} />
        <div className="text-center mt-4">
          <span>{currentWeekLabel}</span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between mt-4">
        <div
          onClick={() => handleWeekChange('previous')}
          style={{ cursor: 'pointer', margin: '10px' }}
        >
          <ArrowBackIosIcon />
        </div>
        <div
          onClick={() => handleWeekChange('next')}
          style={{ cursor: 'pointer', margin: '10px' }}
        >
          <ArrowForwardIosIcon />
        </div>
      </div>

      {/* Monthly Statistics Section */}
      <div className="my-8">
        <StatisticsChart data={monthlyData} onClick={onChangeMonth} />
        <div className="text-center mt-4">
          <span>{currentMonthLabel}</span>
        </div>
      </div>

      {/* Navigation Arrows for Month */}
      <div className="flex justify-between mt-4">
        <div
          onClick={() => handleMonthChange('previous')}
          style={{ cursor: 'pointer', margin: '10px' }}
        >
          <ArrowBackIosIcon />
        </div>
        <div
          onClick={() => handleMonthChange('next')}
          style={{ cursor: 'pointer', margin: '10px' }}
        >
          <ArrowForwardIosIcon />
        </div>
      </div>


    </div>
  );
}
