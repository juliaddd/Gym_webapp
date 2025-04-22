'use client';
import { useState, useEffect } from 'react';
import ProfileIcon from '@/app/components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import NavigationArrows from '@/app/components/arrow';
import { useRouter } from 'next/navigation';

export default function StatisticsPage({ onBack, onChangeWeek, onChangeMonth }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentWeek, setCurrentWeek] = useState({});
  const [currentMonth, setCurrentMonth] = useState({});

  // Example mock data, you can replace it with real API data
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

  // Assuming data is fetched asynchronously (useEffect example)
  useEffect(() => {
    // Simulate fetching data
    setWeeklyData(mockWeeklyData);
    setMonthlyData(mockMonthlyData);
    setCurrentWeek(mockWeeklyData[0]);
    setCurrentMonth(mockMonthlyData[0]);
  }, []);

  // Loading check for weeklyData and monthlyData
  if (!weeklyData.length || !monthlyData.length) {
    return <div>Loading...</div>; // Show loading message until data is available
  }

  // Handle back button click
  const handleBackClick = () => {
    router.back(); // Go back to the previous page
  };

    // Handle profile click (redirect to profile page)
  const handleProfileClick = () => {
    router.push('/profile'); // Redirect to profile page
  };

  return (
    <div>
      {/* Profile Section */}
      <div className="flex justify-end">
        <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={handleProfileClick} />
      </div>

      {/* Weekly Statistics Section */}
      <div className="my-8">
        <StatisticsChart data={weeklyData} onClick={onChangeWeek} />
      </div>

      {/* Monthly Statistics Section */}
      <div className="my-8">
        <StatisticsChart data={monthlyData} onClick={onChangeMonth} />
      </div>

      {/* Navigation Arrows */}
      <div className="my-8">
        <NavigationArrows onPrevious={onChangeWeek} onNext={onChangeMonth} />
      </div>
    </div>
  );
}
