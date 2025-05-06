'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

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

// Component for Category Chart
const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_time" fill="#8884d8" name="Training Hours" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Component for Stacked Category Chart by Subscription
const StackedCategoryChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;
  
  // Transform data for stacked bar chart
  const categories = [...new Set(data.map(item => item.category_name))];
  const subscriptionTypes = [...new Set(data.map(item => item.subscription_type))];
  
  const transformedData = categories.map(category => {
    const categoryData = { category_name: category };
    subscriptionTypes.forEach(subType => {
      const item = data.find(d => d.category_name === category && d.subscription_type === subType);
      categoryData[subType] = item ? item.total_training_time : 0;
    });
    return categoryData;
  });
  
  // Colors for different subscription types
  const colors = {
    'Basic': '#8884d8',    // blue
    'Premium': '#82ca9d',  // green
    'VIP': '#ffc658'       // orange
  };
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {subscriptionTypes.map((subType, index) => (
          <Bar 
            key={subType} 
            dataKey={subType} 
            stackId="a" 
            fill={colors[subType] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
            name={subType}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// Component for Subscription Changes Line Chart
const SubscriptionLineChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;
  
  // Get unique years and subscription types
  const years = [...new Set(data.map(item => item.year))];
  const subscriptionTypes = [...new Set(data.map(item => item.subscription_type))];
  
  // Colors for different subscription types
  const colors = {
    'Basic': '#8884d8',    // blue
    'Premium': '#82ca9d',  // green
    'VIP': '#ffc658'       // orange
  };
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="year" 
          type="category"
          allowDuplicatedCategory={false}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        {subscriptionTypes.map((subType, index) => {
          const subData = data.filter(d => d.subscription_type === subType);
          return (
            <Line
              key={subType}
              type="monotone"
              dataKey="user_count"
              data={subData}
              name={subType}
              stroke={colors[subType] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
              activeDot={{ r: 8 }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Component for Weekly Training Chart
const WeeklyTrainingChart = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day_of_week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_training_time" fill="#8884d8" name="Training Hours" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function AdminStatisticsPage() {
  // Separate offset states for each chart
  const [categoryMonthOffset, setCategoryMonthOffset] = useState(0);
  const [subscriptionMonthOffset, setSubscriptionMonthOffset] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  
  // States for data
  const [categoryStats, setCategoryStats] = useState([]);
  const [categorySubscriptionStats, setCategorySubscriptionStats] = useState([]);
  const [subscriptionChanges, setSubscriptionChanges] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [totalMonthlyTimeCategory, setTotalMonthlyTimeCategory] = useState(0);
  const [totalMonthlyTimeSubscription, setTotalMonthlyTimeSubscription] = useState(0);
  const [totalWeeklyTime, setTotalWeeklyTime] = useState(0);
  const [currentSubscriptionCounts, setCurrentSubscriptionCounts] = useState([]);
  
  // Loading states for each chart
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const [isSubscriptionYearlyLoading, setIsSubscriptionYearlyLoading] = useState(true);
  const [isWeeklyLoading, setIsWeeklyLoading] = useState(true);

  const router = useRouter();

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

  const getWeekRange = (offset) => {
    const now = new Date();
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const currentDayOfWeek = now.getDay();
    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    
    // Find monday of current week, then adjust by offset
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysSinceMonday - (offset * 7));
    monday.setHours(0, 0, 0, 0);
    
    // Find sunday of current week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return {
      from: monday.toISOString().split('T')[0],
      to: sunday.toISOString().split('T')[0],
    };
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

  const getWeekLabel = (offset) => {
    const { from, to } = getWeekRange(offset);
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    const formatDate = (date) => {
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    };
    
    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  };

  const getCurrentSubscriptionSummary = () => {
    if (!currentSubscriptionCounts || currentSubscriptionCounts.length === 0) return 'No data available';
    return currentSubscriptionCounts.map(item => `${item.subscription_type}: ${item.user_count}`).join(', ');
  };

  // Fetch category data when categoryMonthOffset changes
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsCategoryLoading(true);
      try {
        const { from, to } = getMonthRange(categoryMonthOffset);
        console.log(`Fetching category stats from ${from} to ${to}`);

        // Fetch category stats
        const categoryData = await mockFetchStatsByCategory(from, to);
        setCategoryStats(categoryData.map(item => ({
          category_name: item.category_name,
          total_time: item.total_training_time,
        })));

        // Fetch total training time
        const totalTimeData = await mockFetchTotalTrainingTime(from, to);
        setTotalMonthlyTimeCategory(totalTimeData);
      } catch (err) {
        console.error('Error loading category stats:', err);
        setCategoryStats([]);
        setTotalMonthlyTimeCategory(0);
      } finally {
        setIsCategoryLoading(false);
      }
    };
    fetchCategoryData();
  }, [categoryMonthOffset]);
  
  // Fetch subscription data when subscriptionMonthOffset changes
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsSubscriptionLoading(true);
      try {
        const { from, to } = getMonthRange(subscriptionMonthOffset);
        console.log(`Fetching subscription stats from ${from} to ${to}`);

        // Fetch category by subscription stats
        const categorySubData = await mockFetchStatsByCategoryAndSubscription(from, to);
        setCategorySubscriptionStats(categorySubData);

        // Fetch total training time
        const totalTimeData = await mockFetchTotalTrainingTime(from, to);
        setTotalMonthlyTimeSubscription(totalTimeData);
      } catch (err) {
        console.error('Error loading subscription stats:', err);
        setCategorySubscriptionStats([]);
        setTotalMonthlyTimeSubscription(0);
      } finally {
        setIsSubscriptionLoading(false);
      }
    };
    fetchSubscriptionData();
  }, [subscriptionMonthOffset]);

  // Fetch yearly subscription data (once)
  useEffect(() => {
    const fetchYearlyData = async () => {
      setIsSubscriptionYearlyLoading(true);
      try {
        // Fetch subscription changes over years
        const subChanges = await mockFetchSubscriptionChanges();
        setSubscriptionChanges(subChanges);

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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Total Hours by Category This Month</h2>
        {isCategoryLoading ? (
          <div className="flex justify-center items-center h-64">Loading chart data...</div>
        ) : (
          <>
            <CategoryChart data={categoryStats} />
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">
                Total Hours for {categoryMonthLabel.month} {categoryMonthLabel.year}: {getCategoryTotalTime()} hours
              </p>
            </div>
            
            {/* Category Chart Navigation - MODIFIED */}
            <div className="flex justify-between items-center mt-4">
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setCategoryMonthOffset(categoryMonthOffset + 1)}
              >
                <ArrowBackIosIcon style={{ color: 'black' }} />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setCategoryMonthOffset(categoryMonthOffset - 1)}
                disabled={categoryMonthOffset === 0}
              >
                <ArrowForwardIosIcon style={{ color: 'black' }} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Category by Subscription Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Total Hours by Category and Subscription Type</h2>
        {isSubscriptionLoading ? (
          <div className="flex justify-center items-center h-64">Loading chart data...</div>
        ) : (
          <>
            <StackedCategoryChart data={categorySubscriptionStats} />
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">
                Total Hours for {subscriptionMonthLabel.month} {subscriptionMonthLabel.year}: {getSubscriptionTotalTime()} hours
              </p>
            </div>
            
            {/* Subscription Chart Navigation - MODIFIED */}
            <div className="flex justify-between items-center mt-4">
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setSubscriptionMonthOffset(subscriptionMonthOffset + 1)}
              >
                <ArrowBackIosIcon style={{ color: 'black' }} />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setSubscriptionMonthOffset(subscriptionMonthOffset - 1)}
                disabled={subscriptionMonthOffset === 0}
              >
                <ArrowForwardIosIcon style={{ color: 'black' }} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Subscription Changes Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Subscription Type Changes Over Years</h2>
        {isSubscriptionYearlyLoading ? (
          <div className="flex justify-center items-center h-64">Loading chart data...</div>
        ) : (
          <>
            <SubscriptionLineChart data={subscriptionChanges} />
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">
                Current Subscription Counts: {getCurrentSubscriptionSummary()}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Weekly Stats Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Gym Attendance by Day of Week</h2>
        {isWeeklyLoading ? (
          <div className="flex justify-center items-center h-64">Loading chart data...</div>
        ) : (
          <>
            <WeeklyTrainingChart data={weeklyStats} />
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">
                Week of {weekLabel}: {totalWeeklyTime} hours
              </p>
            </div>
            
            {/* Weekly Chart Navigation - MODIFIED */}
            <div className="flex justify-between items-center mt-4">
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setWeekOffset(weekOffset + 1)}
              >
                <ArrowBackIosIcon style={{ color: 'black' }} />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setWeekOffset(weekOffset - 1)}
                disabled={weekOffset === 0}
              >
                <ArrowForwardIosIcon style={{ color: 'black' }} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}