'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BasicBarChart, StackedCategoryChart, SubscriptionLineChart } from '@/app/components/ChartComponents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProfileIcon from '@/app/components/profileicon';
import {
  fetchStatsByCategory,
  fetchTotalTrainingTime,
  fetchStatsByCategoryAndSubscription,
  fetchUserStatsBySubscription,
  fetchTrainingTimeBySubscription,
  fetchStatsByDayOfWeek,
  fetchCategories
} from '../../api';

// Helper functions for date handling
const getMonthRange = (offset = 0) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Calculate target month (going back by offset)
  let targetMonth = currentMonth - offset;
  let targetYear = currentYear;
  
  // Adjust for previous years
  while (targetMonth < 0) {
    targetMonth += 12;
    targetYear -= 1;
  }
  
  // First day of month
  const fromDate = new Date(targetYear, targetMonth, 1);
  
  // Last day of month
  const toDate = new Date(targetYear, targetMonth + 1, 0);
  
  return {
    from: fromDate.toISOString().split('T')[0],
    to: toDate.toISOString().split('T')[0],
    month: fromDate.toLocaleString('default', { month: 'long' }),
    year: targetYear
  };
};

const getWeekRange = (offset = 0) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Find the most recent Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday - (7 * offset));
  
  // Find the Sunday that ends this week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    from: monday.toISOString().split('T')[0],
    to: sunday.toISOString().split('T')[0]
  };
};

// Updated function to format dates as "Month Day - Month Day"
const getWeekLabel = (offset) => {
  const { from, to } = getWeekRange(offset);
  
  // Function to format date as "Month Day"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get month name
    const month = date.toLocaleString('en-US', { month: 'long' });
    
    // Get day of month
    const day = date.getDate();
    
    return `${month} ${day}`;
  };
  
  // Return formatted string "Month Day - Month Day"
  return `${formatDate(from)} - ${formatDate(to)}`;
};

const getMonthName = (offset) => {
  return getMonthRange(offset);
};

const formatWeeklyData = (data) => {
  // Ensure we have entries for all days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const formattedData = [];
  
  // Create a map for quick lookups
  const dataMap = {};
  if (Array.isArray(data)) {
    data.forEach(item => {
      dataMap[item.day_of_week] = item.total_training_time;
    });
  }
  
  // Create an entry for each day of the week, using 0 if no data
  daysOfWeek.forEach(day => {
    formattedData.push({
      day_of_week: day,
      total_training_time: dataMap[day] || 0
    });
  });
  
  console.log('Formatted weekly data:', formattedData);
  return formattedData;
};

// Format time function (minutes to hours and minutes)
const formatTimeHoursMinutes = (totalMinutes) => {
  if (!totalMinutes) return '0 hours 0 minutes';
  
  // Convert to number and round if needed
  const minutes = Math.round(Number(totalMinutes));
  
  // Calculate hours and remaining minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  // If we have both hours and minutes
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
  }
  
  // If we only have hours
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  // If we only have minutes
  return `${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
};

// Main Dashboard Component
export default function StatsDashboard() {
  const router = useRouter();
  
  // State for category statistics
  const [categoryStats, setCategoryStats] = useState([]);
  const [categoryMonthOffset, setCategoryMonthOffset] = useState(0);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [totalMonthlyTimeCategory, setTotalMonthlyTimeCategory] = useState(null);
  
  // State for category by subscription statistics
  const [categorySubscriptionStats, setCategorySubscriptionStats] = useState([]);
  const [subscriptionMonthOffset, setSubscriptionMonthOffset] = useState(0);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const [totalMonthlyTimeSubscription, setTotalMonthlyTimeSubscription] = useState(null);
  
  // State for yearly subscription statistics
  const [subscriptionChanges, setSubscriptionChanges] = useState([]);
  const [currentSubscriptionCounts, setCurrentSubscriptionCounts] = useState([]);
  const [isSubscriptionYearlyLoading, setIsSubscriptionYearlyLoading] = useState(true);
  
  // State for weekly statistics
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isWeeklyLoading, setIsWeeklyLoading] = useState(true);
  const [totalWeeklyTime, setTotalWeeklyTime] = useState(0);
  
  // Format current subscription summary
  const getCurrentSubscriptionSummary = () => {
    if (!currentSubscriptionCounts || currentSubscriptionCounts.length === 0) {
      return "No data available";
    }
    
    return currentSubscriptionCounts.map(item => 
      `${item.subscription_type}: ${formatTimeHoursMinutes(item.training_hours || 0)}`
    ).join(', ');
  };
  
  // Fetch category stats when categoryMonthOffset changes
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsCategoryLoading(true);
      try {
        const { from, to } = getMonthRange(categoryMonthOffset);
        console.log(`Fetching category stats from ${from} to ${to}`);
        
        // First get all categories
        const allCategories = await fetchCategories();
        
        // Get training data
        const rawCatStats = await fetchStatsByCategory(null, from, to);
        
        // Process data to include all categories
        const processedCatStats = [];
        
        // For each category, ensure it's represented in the data
        allCategories.forEach(category => {
          // Look for existing data for this category
          const existingData = rawCatStats.find(item => 
            item.category_name === category.name || 
            item.category_id === category.category_id
          );
          
          if (existingData) {
            // If data exists, add it
            processedCatStats.push(existingData);
          } else {
            // If no data, add an entry with zero value
            processedCatStats.push({
              category_name: category.name,
              category_id: category.category_id,
              total_training_time: 0
            });
          }
        });
        
        setCategoryStats(processedCatStats);
        
        // Get total time for the month
        const totalTime = await fetchTotalTrainingTime(null, from, to);
        setTotalMonthlyTimeCategory(totalTime);
      } catch (err) {
        console.error('Error loading category stats:', err);
        setCategoryStats([]);
        setTotalMonthlyTimeCategory(null);
      } finally {
        setIsCategoryLoading(false);
      }
    };
    fetchCategoryData();
  }, [categoryMonthOffset]);
  
  // Fetch subscription stats when subscriptionMonthOffset changes
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsSubscriptionLoading(true);
      try {
        const { from, to } = getMonthRange(subscriptionMonthOffset);
        console.log(`Fetching subscription stats from ${from} to ${to}`);
        
        // Get all categories first
        const allCategories = await fetchCategories();
        
        // Fetch the raw data from the API
        const rawData = await fetchStatsByCategoryAndSubscription(null, from, to);
        console.log("Raw subscription data:", rawData);
        
        // Process the data to include all categories
        const processedData = [];
        
        // For each category, make sure it has entries for all subscription types
        allCategories.forEach(category => {
          // Find existing data for this category
          const categoryData = rawData.filter(item => 
            item.category_name === category.name
          );
          
          // If no data exists for this category, add entries with zero values
          if (categoryData.length === 0) {
            // Add zero entries for all subscription types
            ['standard', 'premium', 'vip'].forEach(subType => {
              processedData.push({
                category_name: category.name,
                subscription_type: subType,
                total_training_time: 0
              });
            });
          } else {
            // Add the existing data
            categoryData.forEach(item => {
              processedData.push(item);
            });
          }
        });
        
        setCategorySubscriptionStats(processedData);
        
        // Fetch total monthly time
        const totalTime = await fetchTotalTrainingTime(null, from, to);
        setTotalMonthlyTimeSubscription(totalTime);
      } catch (err) {
        console.error('Error loading subscription stats:', err);
        setCategorySubscriptionStats([]);
        setTotalMonthlyTimeSubscription(null);
      } finally {
        setIsSubscriptionLoading(false);
      }
    };
    fetchSubscriptionData();
  }, [subscriptionMonthOffset]);
  
  // Fetch yearly subscription data on component mount
  useEffect(() => {
    const fetchSubscriptionTrainingData = async () => {
      setIsSubscriptionYearlyLoading(true);
      try {
        // Define date range: beginning of last year to today
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        oneYearAgo.setMonth(0, 1); // January 1st of last year
        const startDate = oneYearAgo.toISOString().split('T')[0];
        
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        
        // Get training data by subscription for the period
        const subscriptionData = await fetchTrainingTimeBySubscription(
          null, // null for all users (admin view)
          startDate,
          endDate
        );
        console.log("Raw subscription data:", subscriptionData);
        if (!subscriptionData || !Array.isArray(subscriptionData) || subscriptionData.length === 0) {
          console.log("No subscription data returned from API");
          setSubscriptionChanges([]);
          setCurrentSubscriptionCounts([]);
          setIsSubscriptionYearlyLoading(false);
          return;
        }
        // Transform data for chart display
        // Add more user-friendly date representation for the chart
        const formattedData = subscriptionData.map(item => {
          const [year, month] = item.month_year.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          return {
            ...item,
            // Format the date for display on X axis
            monthYear: date.toLocaleString('default', { month: 'short', year: 'numeric' })
          };
        });
        
        setSubscriptionChanges(formattedData);
        
        // Get data for current month for summary
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const currentMonthEnd = today.toISOString().split('T')[0];
        
        const currentMonthData = await fetchStatsByCategoryAndSubscription(null, currentMonthStart, currentMonthEnd);
        
        // Sum training hours by subscription type for current month
        const subscriptionTotals = {};
        currentMonthData.forEach(item => {
          if (!subscriptionTotals[item.subscription_type]) {
            subscriptionTotals[item.subscription_type] = 0;
          }
          subscriptionTotals[item.subscription_type] += item.total_training_time;
        });
        
        // Format for display
        const currentSubscriptionData = Object.entries(subscriptionTotals).map(([subType, hours]) => ({
          subscription_type: subType,
          training_hours: hours
        }));
        
        setCurrentSubscriptionCounts(currentSubscriptionData);
        
      } catch (err) {
        console.error('Error loading subscription training data:', err);
        setSubscriptionChanges([]);
        setCurrentSubscriptionCounts([]);
      } finally {
        setIsSubscriptionYearlyLoading(false);
      }
    };
    
    fetchSubscriptionTrainingData();
  }, []);

  // Fetch weekly stats when weekOffset changes
  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsWeeklyLoading(true);
      try {
        const { from, to } = getWeekRange(weekOffset);
        console.log(`Fetching weekly stats from ${from} to ${to}`);
        
        // For admin, pass null instead of userId to get data for all users
        const stats = await fetchStatsByDayOfWeek(null, from, to);
        console.log("Weekly stats for all users:", stats);
        
        // Make sure to use formatWeeklyData to structure the data
        const formattedData = formatWeeklyData(stats);
        console.log('Formatted weekly data:', formattedData);
        
        setWeeklyStats(formattedData);
        
        // Calculate total time for the week
        const totalTime = formattedData.reduce((sum, item) => sum + item.total_training_time, 0);
        setTotalWeeklyTime(totalTime);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // In case of error, create data with all days and zero values
        const emptyData = formatWeeklyData([]);
        setWeeklyStats(emptyData);
        setTotalWeeklyTime(0);
      } finally {
        setIsWeeklyLoading(false);
      }
    };
  
    fetchWeeklyData();
  }, [weekOffset]);

  const handleBackClick = () => {
    router.back();
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  // Get time period labels
  const categoryMonthLabel = getMonthName(categoryMonthOffset);
  const subscriptionMonthLabel = getMonthName(subscriptionMonthOffset);
  const weekLabel = getWeekLabel(weekOffset);

  // Get total times for summaries
  const getCategoryTotalTime = () => totalMonthlyTimeCategory?.total_training_time || 0;
  const getSubscriptionTotalTime = () => totalMonthlyTimeSubscription?.total_training_time || 0;
  
  // Conditional rendering for loading states
  if (isCategoryLoading && isSubscriptionLoading && isSubscriptionYearlyLoading && isWeeklyLoading) {
    return <div className="flex justify-center items-center h-screen">Loading statistics...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center cursor-pointer" onClick={handleBackClick}>
          <ArrowBackIcon />
          <span className="ml-2 text-lg">Back</span>
        </div>
      </div>

      {/* Category Chart */}
      <BasicBarChart
        title="Total Hours by Category This Month"
        data={categoryStats}
        dataKey="total_training_time"
        xAxisKey="category_name"
        period={`${categoryMonthLabel.month} ${categoryMonthLabel.year}`}
        totalValue={getCategoryTotalTime()}
        isLoading={isCategoryLoading}
        offset={categoryMonthOffset}
        setOffset={setCategoryMonthOffset}
        disableNext={categoryMonthOffset === 0}
      />

      {/* Category by Subscription Chart */}
      <StackedCategoryChart
        title="Total Hours by Category and Subscription Type"
        data={categorySubscriptionStats}
        period={`${subscriptionMonthLabel.month} ${subscriptionMonthLabel.year}`}
        totalValue={getSubscriptionTotalTime()}
        isLoading={isSubscriptionLoading}
        offset={subscriptionMonthOffset}
        setOffset={setSubscriptionMonthOffset}
      />

      {/* Subscription Changes Chart */}
      <SubscriptionLineChart
        title="Training Hours by Subscription Type Over Time"
        data={subscriptionChanges}
        summary={`Current Month Training: ${getCurrentSubscriptionSummary()}`}
        isLoading={isSubscriptionYearlyLoading}
      />
      
      {/* Weekly Stats Chart */}
      <BasicBarChart
        title="Gym Attendance by Day of Week"
        data={weeklyStats}
        dataKey="total_training_time"
        xAxisKey="day_of_week"
        period={weekLabel}
        totalValue={totalWeeklyTime}
        isLoading={isWeeklyLoading}
        offset={weekOffset}
        setOffset={setWeekOffset}
        disableNext={weekOffset === 0}
        minYAxis={4}
      />
    </div>
  );
}