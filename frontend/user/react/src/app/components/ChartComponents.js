'use client';
import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Component for Basic Bar Chart - used for Category and Weekly stats
export const BasicBarChart = ({ 
  title, 
  data, 
  dataKey, 
  xAxisKey,
  period,
  totalValue,
  isLoading,
  offset,
  setOffset,
  disableNext = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-64">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#8884d8" name="Training Hours" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div>No data available</div>
      )}
      
      <div className="text-center mt-4">
        <p className="text-lg font-semibold">
          {period}: {totalValue} hours
        </p>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setOffset(offset + 1)}
        >
           <ArrowBackIosIcon style={{ color: 'black' }} />
        </button>
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setOffset(offset - 1)}
          disabled={disableNext || offset === 0}
        >
          <ArrowForwardIosIcon style={{ color: 'black' }} />
        </button>
      </div>
    </div>
  );
};

// Component for Stacked Category Chart by Subscription
export const StackedCategoryChart = ({ 
  title,
  data, 
  period,
  totalValue,
  isLoading,
  offset,
  setOffset
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-64">Loading chart data...</div>
      </div>
    );
  }

  // Transform data for stacked bar chart if data exists
  let transformedData = [];
  let subscriptionTypes = [];
  let colors = {
    'Basic': '#8884d8',    // blue
    'Premium': '#82ca9d',  // green
    'VIP': '#ffc658'       // orange
  };

  if (data && data.length > 0) {
    const categories = [...new Set(data.map(item => item.category_name))];
    subscriptionTypes = [...new Set(data.map(item => item.subscription_type))];
    
    transformedData = categories.map(category => {
      const categoryData = { category_name: category };
      subscriptionTypes.forEach(subType => {
        const item = data.find(d => d.category_name === category && d.subscription_type === subType);
        categoryData[subType] = item ? item.total_training_time : 0;
      });
      return categoryData;
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {subscriptionTypes.map((subType) => (
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
      ) : (
        <div>No data available</div>
      )}
      
      <div className="text-center mt-4">
        <p className="text-lg font-semibold">
          {period}: {totalValue} hours
        </p>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setOffset(offset + 1)}
        >
          <ArrowBackIosIcon style={{ color: 'black' }} />
        </button>
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setOffset(offset - 1)}
          disabled={offset === 0}
        >
          <ArrowForwardIosIcon style={{ color: 'black' }} />
        </button>
      </div>
    </div>
  );
};

// Component for Subscription Changes Line Chart
export const SubscriptionLineChart = ({ 
  title,
  data, 
  summary,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-64">Loading chart data...</div>
      </div>
    );
  }

  // Colors for different subscription types
  const colors = {
    'Basic': '#8884d8',    // blue
    'Premium': '#82ca9d',  // green
    'VIP': '#ffc658'       // orange
  };

  // Get unique subscription types if data exists
  let subscriptionTypes = [];
  if (data && data.length > 0) {
    subscriptionTypes = [...new Set(data.map(item => item.subscription_type))];
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {data && data.length > 0 ? (
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
            {subscriptionTypes.map((subType) => {
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
      ) : (
        <div>No data available</div>
      )}
      
      <div className="text-center mt-4">
        <p className="text-lg font-semibold">
          {summary}
        </p>
      </div>
    </div>
  );
};