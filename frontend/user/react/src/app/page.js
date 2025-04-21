'use client';
import { useState } from 'react';
import ProfileIcon from './components/profileicon';
import StatisticsChart from './components/statisticschart';
import CategoryGrid from './components/categorygrid';

export default function UserMainPage() {
  // Define a basic user object for the layout CHANGE LATER
  const user = {
    avatar: 'https://example.com/user-avatar.jpg',
    name: 'John Doe',
  };

  // Define basic statistics data for the layout CHANGE LATER get_training_time_by_day_of_week
  const statistics = [
    { day: 'Monday', value: 30 },
    { day: 'Tuesday', value: 40 },
    { day: 'Wednesday', value: 20 },
    { day: 'Thursday', value: 50 },
    { day: 'Friday', value: 60 },
    { day: 'Saturday', value: 55 },
    { day: 'Sunday', value: 70 },
  ];

  // Define basic categories data for the layout
  const categories = [
    { id: 1, title: 'Cardio', imageUrl: '/path-to-cardio-image.jpg' },
    { id: 2, title: 'Stretching', imageUrl: '/path-to-stretching-image.jpg' },
    { id: 3, title: 'Back', imageUrl: '/path-to-back-image.jpg' },
    { id: 4, title: 'Arms', imageUrl: '/path-to-arms-image.jpg' },
    { id: 5, title: 'Legs', imageUrl: '/path-to-legs-image.jpg' },
    { id: 6, title: 'Abs', imageUrl: '/path-to-abs-image.jpg' },
  ];

  // Handle profile click (redirect to profile page)
  const handleProfileClick = () => {
    window.location.href = '/profile'; // Redirect to profile page
  };

  // Handle category selection (redirect to training page)
  const handleCategorySelect = (category) => {
    console.log('Selected category:', category.title);
    window.location.href = `/training/${category.title.toLowerCase()}`; // Redirect to training page for selected category
  };

  // Handle statistics click (redirect to statistics page)
  const handleStatisticsClick = () => {
    window.location.href = '/statistics'; // Redirect to statistics page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Section */}
      <div className="flex justify-end">
        <ProfileIcon userImage={user.avatar} onClick={handleProfileClick} />
      </div>

      {/* Statistics Section */}
      <div className="my-8">
        <StatisticsChart data={statistics} onClick={handleStatisticsClick} />
      </div>

      {/* Categories Grid */}
      <div className="my-8">
        <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
      </div>
    </div>
  );
}
