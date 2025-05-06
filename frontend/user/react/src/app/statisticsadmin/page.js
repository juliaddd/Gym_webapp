'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BasicBarChart, StackedCategoryChart, SubscriptionLineChart } from '@/app/components/ChartComponents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProfileIcon from '@/app/components/profileicon';

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

const getWeekLabel = (offset) => {
  const { from, to } = getWeekRange(offset);
  return `${from} to ${to}`;
};

const getMonthName = (offset) => {
  return getMonthRange(offset);
};

// Mock API functions based on the entity model
const mockFetchStatsByCategory = async (from, to) => {
  return [
    { category_name: 'Cardio', total_training_time: 300 },
    { category_name: 'Strength', total_training_time: 200 },
    { category_name: 'Flexibility', total_training_time: 150 },
  ];
};

const mockFetchStatsByCategoryAndSubscription = async (from, to) => {
  return [
    { category_name: 'Cardio', subscription_type: 'Basic', total_training_time: 100 },
    { category_name: 'Cardio', subscription_type: 'Premium', total_training_time: 200 },
    { category_name: 'Cardio', subscription_type: 'VIP', total_training_time: 150 },
    { category_name: 'Strength', subscription_type: 'Basic', total_training_time: 80 },
    { category_name: 'Strength', subscription_type: 'Premium', total_training_time: 120 },
    { category_name: 'Strength', subscription_type: 'VIP', total_training_time: 90 },
    { category_name: 'Flexibility', subscription_type: 'Basic', total_training_time: 50 },
    { category_name: 'Flexibility', subscription_type: 'Premium', total_training_time: 100 },
    { category_name: 'Flexibility', subscription_type: 'VIP', total_training_time: 70 },
  ];
};

const mockFetchSubscriptionChanges = async () => {
  return [
    { year: 2021, subscription_type: 'Basic', user_count: 120 },
    { year: 2021, subscription_type: 'Premium', user_count: 80 },
    { year: 2021, subscription_type: 'VIP', user_count: 50 },
    { year: 2022, subscription_type: 'Basic', user_count: 140 },
    { year: 2022, subscription_type: 'Premium', user_count: 100 },
    { year: 2022, subscription_type: 'VIP', user_count: 70 },
    { year: 2023, subscription_type: 'Basic', user_count: 100 },
    { year: 2023, subscription_type: 'Premium', user_count: 60 },
    { year: 2023, subscription_type: 'VIP', user_count: 90 },
    { year: 2024, subscription_type: 'Basic', user_count: 150 },
    { year: 2024, subscription_type: 'Premium', user_count: 130 },
    { year: 2024, subscription_type: 'VIP', user_count: 110 },
    { year: 2025, subscription_type: 'Basic', user_count: 80 },
    { year: 2025, subscription_type: 'Premium', user_count: 100 },
    { year: 2025, subscription_type: 'VIP', user_count: 90 },
  ];
};

const mockFetchStatsByDayOfWeek = async (from, to) => {
  return [
    { day_of_week: 'Monday', total_training_time: 400 },
    { day_of_week: 'Tuesday', total_training_time: 350 },
    { day_of_week: 'Wednesday', total_training_time: 300 },
    { day_of_week: 'Thursday', total_training_time: 320 },
    { day_of_week: 'Friday', total_training_time: 280 },
    { day_of_week: 'Saturday', total_training_time: 200 },
    { day_of_week: 'Sunday', total_training_time: 150 },
  ];
};

const mockFetchTotalTrainingTime = async (from, to) => {
  return { total_training_time: 650 };
};

const mockFetchCurrentSubscriptionCounts = async () => {
  return [
    { subscription_type: 'Basic', user_count: 80 },
    { subscription_type: 'Premium', user_count: 100 },
    { subscription_type: 'VIP', user_count: 90 },
  ];
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
      `${item.subscription_type}: ${item.user_count}`
    ).join(', ');
  };
  
  // Fetch category stats when categoryMonthOffset changes
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsCategoryLoading(true);
      try {
        const { from, to } = getMonthRange(categoryMonthOffset);
        console.log(`Fetching category stats from ${from} to ${to}`);
        
        // Fetch category stats
        const catStats = await mockFetchStatsByCategory(from, to);
        setCategoryStats(catStats);
        
        // Fetch total monthly time
        const totalTime = await mockFetchTotalTrainingTime(from, to);
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
        
        // Fetch category by subscription stats
        const subStats = await mockFetchStatsByCategoryAndSubscription(from, to);
        setCategorySubscriptionStats(subStats);
        
        // Fetch total monthly time
        const totalTime = await mockFetchTotalTrainingTime(from, to);
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
    const fetchYearlyData = async () => {
      setIsSubscriptionYearlyLoading(true);
      try {
        // Fetch subscription changes over years
        const changes = await mockFetchSubscriptionChanges();
        setSubscriptionChanges(changes);
        
        // Fetch current subscription counts
        const subCounts = await mockFetchCurrentSubscriptionCounts();
        setCurrentSubscriptionCounts(subCounts);
      } catch (err) {
        console.error('Error loading yearly stats:', err);
        setSubscriptionChanges([]);
        setCurrentSubscriptionCounts([]);
      } finally {
        setIsSubscriptionYearlyLoading(false);
      }
    };
    fetchYearlyData();
  }, []);
  
  // Fetch weekly stats when weekOffset changes
  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsWeeklyLoading(true);
      try {
        const { from, to } = getWeekRange(weekOffset);
        console.log(`Fetching weekly stats from ${from} to ${to}`);
        
        // Fetch weekly stats
        const dayStats = await mockFetchStatsByDayOfWeek(from, to);
        setWeeklyStats(dayStats);
        
        // Calculate total weekly time
        const totalTime = dayStats.reduce((sum, item) => sum + item.total_training_time, 0);
        setTotalWeeklyTime(totalTime);
      } catch (err) {
        console.error('Error loading weekly stats:', err);
        setWeeklyStats([]);
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
        <div>
          <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={handleProfileClick} />
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
        title="Subscription Type Changes Over Years"
        data={subscriptionChanges}
        summary={`Current Subscription Counts: ${getCurrentSubscriptionSummary()}`}
        isLoading={isSubscriptionYearlyLoading}
      />

      {/* Weekly Stats Chart */}
      <BasicBarChart
        title="Gym Attendance by Day of Week"
        data={weeklyStats}
        dataKey="total_training_time"
        xAxisKey="day_of_week"
        period={`Week of ${weekLabel}`}
        totalValue={totalWeeklyTime}
        isLoading={isWeeklyLoading}
        offset={weekOffset}
        setOffset={setWeekOffset}
        disableNext={weekOffset === 0}
      />
    </div>
  );
}