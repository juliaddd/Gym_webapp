'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from './components/profileicon';
import StatisticsChart from './components/statisticschart';
import CategoryGrid from './components/categorygrid';

export default function UserMainPage() {
  const router = useRouter(); // Next.js useRouter hook for navigation
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
    router.push('/profile'); // Redirect to profile page
  };

  // Handle category selection (redirect to training page)
const handleCategorySelect = (category) => {
  console.log('Selected category:', category.title);
  router.push(`/training/${category.title.toLowerCase()}`); // Use router.push instead
};

// Handle statistics click (redirect to statistics page)
const handleStatisticsClick = () => {
  router.push('/statisticsuser'); // Use router.push instead
};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Section */}
      <div className="flex justify-end">
        <ProfileIcon userImage={user.avatar} onClick={handleProfileClick} />
      </div>

      {/* Statistics Section */}
      <h1 className="text-2xl font-bold mb-4">Your Weekly Workout Statistics</h1>
      <div className="my-8">
        <StatisticsChart data={statistics}/>
        {/* Кликабельный текст для просмотра полной статистики */}
      <button
        onClick={handleStatisticsClick}
        className="text-blue-500 hover:text-blue-700 underline"
      >
        See full statistics
      </button>
      </div>


      {/* Categories Grid */}
      <div className="my-8">
        <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
      </div>
    </div>
  );
}
