'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import MonthlyCategoryChart from '@/app/components/MonthlyCategoryChart';
import CategoryPieChart from '@/app/components/CategoryPieChart';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchUserById, fetchStatsByDayOfWeek, fetchStatsByCategory, fetchCategories, fetchTotalTrainingTime } from '../../api';

// Time change func
const formatTimeHoursMinutes = (totalMinutes) => {
  if (!totalMinutes) return '0 hours 0 minutes';
  const minutes = Math.round(Number(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
};

export default function StatisticsPage({ onBack, onChangeWeek, onChangeMonth }) {
  const [allMonthlyData, setAllMonthlyData] = useState([]);

  const [weekOffset, setWeekOffset] = useState(0);
  const [weekStatistics, setWeekStatistics] = useState([]);

  const [monthOffset, setMonthOffset] = useState(0);
  const [monthStatistics, setMonthStatistics] = useState([]);

  const [totalMonthlyTime, setTotalMonthlyTime] = useState(0);
  const [allTimeCategoryStats, setAllTimeCategoryStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Форматируем даты для заголовка
  const formatDate = (dateStr) => {
    const dateParts = dateStr.split('-');
    return `${dateParts[2]} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(dateParts[1])-1]}`;
  };
  
  const weekTitle = `${formatDate(from)} - ${formatDate(to)}`;

  return (
    <div>
      {/* Profile Section */}
      <div className="w-full flex justify-between items-center mb-4">
        {/* Back Button and Header */}
        <div className="flex items-center">
          <div className="back-button cursor-pointer flex items-center" onClick={handleBackClick}>
            <ArrowBackIcon />
            <span style={{ marginLeft: '5px' }}>Back</span>
          </div>
        </div>
        {/* Profile Icon */}
        <div className="profile-icon">
          <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={handleProfileClick} />
        </div>
      </div>

      {/* Weekly Statistics Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          textAlign: 'center', 
          marginBottom: '20px',
          fontWeight: '500'
        }}>
          {weekTitle}
        </h2>
        
        <div style={{ 
          position: 'relative', 
          padding: '0 50px',
          marginBottom: '20px'
        }}>
          <div 
            onClick={() => setWeekOffset(weekOffset - 1)}
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#f0f0f0',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 2
            }}
          >
            <ArrowBackIosIcon style={{ marginLeft: '8px' }} />
          </div>
          
          {/* График */}
          <StatisticsChart data={weekStatistics} onClick={onChangeWeek} units="minutes" />
          
          {/* Правая стрелка */}
          <div 
            onClick={() => setWeekOffset(weekOffset + 1)}
            style={{
              position: 'absolute',
              right: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#f0f0f0',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 2
            }}
          >
            <ArrowForwardIosIcon />
          </div>
        </div>
        
        {/* Общее время */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            fontSize: '18px', 
            fontWeight: '500',
            marginBottom: '10px'
          }}>
            Total hours: {formatTimeHoursMinutes(getWeeklyTotalTime())}
          </p>
        </div>
      </div>

      {/* Monthly Statistics Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          textAlign: 'center', 
          marginBottom: '20px',
          fontWeight: '500'
        }}>
          {month} {year}
        </h2>
        
        <div style={{ 
          position: 'relative', 
          padding: '0 50px',
          marginBottom: '20px'
        }}>
          {/* Левая стрелка */}
          <div 
            onClick={() => setMonthOffset(monthOffset + 1)}
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#f0f0f0',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 2
            }}
          >
            <ArrowBackIosIcon style={{ marginLeft: '8px' }} />
          </div>
          
          <MonthlyCategoryChart data={monthStatistics} />
          
          {/* Правая стрелка */}
          <div 
            onClick={() => setMonthOffset(monthOffset - 1)}
            style={{
              position: 'absolute',
              right: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#f0f0f0',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 2
            }}
          >
            <ArrowForwardIosIcon />
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            fontSize: '18px', 
            fontWeight: '500',
            marginBottom: '10px'
          }}>
            Total hours: {formatTimeHoursMinutes(getMonthlyTotalTime())}
          </p>
        </div>
      </div>

      {/* All-time Stats Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          textAlign: 'center', 
          marginBottom: '20px',
          fontWeight: '500'
        }}>
          Percentage breakdown by category
        </h2>
        
        <CategoryPieChart data={allTimeCategoryStats} />
      </div>
    </div>
  );
}