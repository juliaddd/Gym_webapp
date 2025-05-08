'use client';
import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Component for Basic Bar Chart - used for Category and Weekly stats
// Обновите компонент BasicBarChart в ChartComponents.js
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
  disableNext = false,
  minYAxis = null  // Новый параметр
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-64">Loading chart data...</div>
      </div>
    );
  }

  // Определяем, есть ли ненулевые данные
  const hasNonZeroValues = data && 
  Array.isArray(data) && 
  data.some(item => item[dataKey] > 0);

// Устанавливаем фиксированный диапазон для оси Y, если все значения равны нулю
const yAxisProps = !hasNonZeroValues ? { domain: [0, 5] } : {};

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis {...yAxisProps} />
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

  // Define all possible subscription types and their colors
  const allSubscriptionTypes = ['standard', 'premium', 'vip'];
  const colors = {
    'standard': '#8884d8',  // blue
    'premium': '#82ca9d',   // green
    'vip': '#ffc658'        // orange
  };

  // Transform data for stacked bar chart
  let transformedData = [];
  
  if (data && data.length > 0) {
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category_name))];
    
    // Create a structured dataset with all combinations
    transformedData = categories.map(category => {
      const categoryData = { category_name: category };
      
      // Initialize all subscription types with zero
      allSubscriptionTypes.forEach(subType => {
        categoryData[subType] = 0;
      });
      
      // Fill in actual values where they exist
      data.forEach(item => {
        if (item.category_name === category && 
            allSubscriptionTypes.includes(item.subscription_type)) {
          categoryData[item.subscription_type] = item.total_training_time;
        }
      });
      
      return categoryData;
    });
  }

  // Custom tooltip that shows all subscription types, even if zero
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md">
          <p className="font-bold">{label}</p>
          {allSubscriptionTypes.map(subType => {
            // Find this subscription type in the payload
            const dataPoint = payload.find(p => p.dataKey === subType);
            // Use the value if found, otherwise default to 0
            const value = dataPoint ? dataPoint.value : 0;
            
            return (
              <p key={subType} style={{color: colors[subType] || '#000'}}>
                {subType}: {value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {transformedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category_name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {/* Always render bars for all subscription types */}
            {allSubscriptionTypes.map((subType) => (
              <Bar 
                key={subType} 
                dataKey={subType} 
                stackId="a" 
                fill={colors[subType]}
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
    'standard': '#8884d8',    // blue
    'premium': '#82ca9d',     // green
    'vip': '#ffc658'          // orange
  };

  // Get unique subscription types if data exists
  let subscriptionTypes = [];
  if (data && data.length > 0) {
    subscriptionTypes = [...new Set(data.map(item => item.subscription_type))];
  }

  // Уникальные месяцы для оси X
  const uniqueMonths = [...new Set(data.map(item => item.monthYear))];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="monthYear" 
              type="category" 
              allowDuplicatedCategory={false}
              // Используем только уникальные месяцы для оси X
              data={uniqueMonths.map(month => ({ monthYear: month }))}
            />
            <YAxis label={{ value: 'Training Hours', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {subscriptionTypes.map((subType) => {
              const subData = data.filter(d => d.subscription_type === subType);
              return (
                <Line
                  key={subType}
                  type="monotone"
                  dataKey="total_training_time"
                  data={subData}
                  name={subType}
                  stroke={colors[subType] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                  activeDot={{ r: 8 }}
                  connectNulls={true}
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