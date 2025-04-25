'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import MonthlyCategoryChart from '@/app/components/MonthlyCategoryChart'
import CategoryPieChart from '@/app/components/CategoryPieChart'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchUserById, fetchStatsByDayOfWeek, fetchStatsByCategory, fetchCategories, fetchTotalTrainingTime  } from '../../api'; 


export default function StatisticsPage({ onBack, onChangeWeek, onChangeMonth }) {
  const [allMonthlyData, setAllMonthlyData] = useState([]);

  const [weekOffset, setWeekOffset] = useState(0);
  const [weekStatistics, setWeekStatistics] = useState([]);

  const [monthOffset, setMonthOffset] = useState(0);
  const [monthStatistics, setMonthStatistics] = useState([]);

  const [totalMonthlyTime, setTotalMonthlyTime] = useState(0);
  const [allTimeCategoryStats, setAllTimeCategoryStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const router = useRouter();


  // function to get start and end dates of the week
  const getWeekRange = (offset) => {
    const now = new Date();
    const currentDay = now.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + offset * 7);
    monday.setHours(0, 0, 0, 0);
  
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
  
    return {
      from: monday.toISOString().split('T')[0],
      to: sunday.toISOString().split('T')[0],
    };
  };

  const getMonthRange = (offset) => {
    const now = new Date();
    

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
  

    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);
  
    return {
      from: firstDayOfMonth.toISOString().split('T')[0],
      to: lastDayOfMonth.toISOString().split('T')[0],
    };
  };

    // Update getMonthlyTotalTime to use the stored total_time
   const getMonthlyTotalTime = () => {
     return totalMonthlyTime?.total_training_time || 0;
  };
    

  const getMonthName = (offset) => {
    const now = new Date();
    
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthName = monthNames[monthDate.getMonth()];
    const year = monthDate.getFullYear();
  
    return {
      month: monthName,
      year: year,
    };
  };

  const getWeeklyTotalTime = () => {
    if (!weekStatistics || weekStatistics.length === 0) return 0;
    return weekStatistics.reduce((sum, item) => sum + item.total_training_time, 0);
  };

  useEffect(() => {
    const fetchWeekStatisticsData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) throw new Error('User ID not found');
  
        const { from, to } = getWeekRange(weekOffset);
        const stats = await fetchStatsByDayOfWeek(userId, from, to);
  
        setWeekStatistics(stats);
        console.log('Stats for week:', from, '-', to, stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setWeekStatistics([]);
      }
    };
  
    fetchWeekStatisticsData();
  }, [weekOffset]);

  useEffect(() => {
    const fetchMonthData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('user_id');
        const { from, to } = getMonthRange(monthOffset);
        console.log(`Fetching stats from ${from} to ${to}`);

        // Fetch stats by category
        const data = await fetchStatsByCategory(userId, from, to);
        const allCategories = await fetchCategories() || [];
  
        // Transform data to match expected format
        const transformedData = allCategories.map(category => {
          const categoryData = data.find(item => item.category_id === category.category_id);
          return {
            category_name: category.name,
            total_time: categoryData ? categoryData.total_training_time : 0,
          };
        });
  
        // Fetch total training time
        const totalTimeData = await fetchTotalTrainingTime(userId, from, to);
        setTotalMonthlyTime(totalTimeData);
        // Set the transformed data for categories
      setMonthStatistics(transformedData);
      
      } catch (err) {
        console.error('Error loading monthly stats:', err);
        setMonthStatistics([]);
        setTotalMonthlyTime(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMonthData();
  }, [monthOffset]);
  
  useEffect(() => {
    const fetchPieData = async () => {
    const userId = localStorage.getItem('user_id');
    const allTimeFrom = '2000-01-01';
    const today = new Date().toISOString().split('T')[0];
    

    const data = await fetchStatsByCategory(userId, allTimeFrom, today);
    const allCategories = await fetchCategories() || [];

    const transformedData = allCategories.map(category => {
        const categoryData = data.find(item => item.category_id === category.category_id);
        return {
          category_name: category.name,
          total_training_time: categoryData ? categoryData.total_training_time : 0,
        };
      });
      setAllTimeCategoryStats(transformedData);
    };
    fetchPieData();
  }, []);


  // Handle back button click
  const handleBackClick = () => {
    router.back();
  };

  // Handle profile click
  const handleProfileClick = () => {
    router.push('/profile');
  };
  const { from, to } = getWeekRange(weekOffset);
  const { month, year } = getMonthName(monthOffset);

  if (isLoading) {
    return <div>Loading statistics...</div>;
  }

  if (!weekStatistics || weekStatistics.length === 0) {
    return <div>Loading week statistics...</div>;
  }
  if (!monthStatistics || monthStatistics.length === 0) {
    return <div>Loading month statistics...</div>;
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
        <StatisticsChart data={weekStatistics} onClick={onChangeWeek} />
      </div>

      {/* Navigation Arrows for Week */}
      <div className="flex justify-between mt-4">
        <div
          onClick={() => setWeekOffset(weekOffset - 1)}
        >
          <ArrowBackIosIcon />
        </div>
        <div
          onClick={() => setWeekOffset(weekOffset + 1)}
        >
          <ArrowForwardIosIcon />
        </div>
      </div>

      <div className="text-center mt-2">
      <p className="text-center text-lg font-semibold mb-2"> Week: {from} — {to} </p>
      <p className="text-lg font-semibold">
          Total Weekly Training Time: {getWeeklyTotalTime()} minutes
      </p>
      </div>
      {/* Monthly Statistics Section */}
      <div className="my-8">
        <MonthlyCategoryChart data={monthStatistics} />
      </div>

      {/* Navigation Arrows for Month */}
      <div className="flex justify-between mt-4">
        <div
          onClick={() => setMonthOffset(monthOffset + 1)}
        >
          <ArrowBackIosIcon />
        </div>
        <div
          onClick={() => setMonthOffset(monthOffset - 1)}
        >
          <ArrowForwardIosIcon />
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-center text-lg font-semibold mb-2"> Month:{month} {year} </p>
          <p className="text-lg font-semibold">
            Total Monthly Training Time: {getMonthlyTotalTime()} minutes
          </p>
        </div>

        {/* Pie Chart Section */}
        <CategoryPieChart
        data={allTimeCategoryStats}
        />
    </div>
  );
}