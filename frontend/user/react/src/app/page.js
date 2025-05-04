'use client';
import { useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from './components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import CategoryGrid from './components/categorygrid';
import { fetchUserById, fetchStatsByDayOfWeek, fetchCategories } from '../api'; 

export default function UserMainPage() {
  const router = useRouter(); // Next.js useRouter hook for navigation

  const [user, setUser] = useState({
    avatar: 'https://example.com/user-avatar.jpg',
    name: 'Loading...',
  });

  const [statistics, setStatistics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Loading user data during mountiong

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
          router.push('/login');
          return;
        }

        const userData = await fetchUserById(userId);
        setUser({
          avatar: userData.avatar || 'https://example.com/user-avatar.jpg', // if there are no prof pic
          name: `${userData.name} ${userData.surname || ''}`.trim(),
        });

        if (isMounted) setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        router.push('/login');
      }
    };

    loadUser();

    return () => { isMounted = false; };
  }, []);

  // Define basic statistics data 
  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

        // Определяем понедельник текущей недели
      const today = new Date();
      const dayOfWeek = today.getDay(); // воскресенье — 0, понедельник — 1, ..., суббота — 6
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // если воскресенье — идем назад на 6 дней
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      // Воскресенье текущей недели — прибавим 6 дней от понедельника
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      // Преобразуем в строки
      const dateFrom = monday.toISOString().split('T')[0];
      const dateTo = sunday.toISOString().split('T')[0];
      const stats = await fetchStatsByDayOfWeek(userId, dateFrom, dateTo);

        // Приводим данные к формату, который ожидает StatisticsChart
        // const formattedStats = stats.map((stat) => ({
        //   day: stat.day_of_week,
        //   value: stat.total_training_time,
        // }));
        setStatistics(stats);
        console.log('Formatted Stats for Chart:', stats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Если ошибка, можно показать заглушку
        setStatistics([
          { day: 'Monday', value: 0 },
          { day: 'Tuesday', value: 0 },
          { day: 'Wednesday', value: 0 },
          { day: 'Thursday', value: 0 },
          { day: 'Friday', value: 0 },
          { day: 'Saturday', value: 0 },
          { day: 'Sunday', value: 0 },
        ]);
      }
    };

    fetchStatisticsData();
  }, []);

  // Define basic categories 
    // Загрузка категорий
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        // Приводим данные к формату, который ожидает CategoryGrid
        const formattedCategories = categoriesData.map((category) => ({
          id: category.category_id,
          title: category.name,
          imageUrl: category.image || '/path-to-default-image.jpg', // Если image не указан
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Если ошибка, можно показать заглушку
        setCategories([
          { id: 1, title: 'Abs', imageUrl: '/path-to-cardio-image.jpg' },
          { id: 2, title: 'Stretching', imageUrl: '/path-to-stretching-image.jpg' },
          { id: 3, title: 'Back', imageUrl: '/path-to-back-image.jpg' },
          { id: 4, title: 'Arms', imageUrl: '/path-to-arms-image.jpg' },
          { id: 5, title: 'Legs', imageUrl: '/path-to-legs-image.jpg' },
          { id: 6, title: 'Cardio', imageUrl: '/path-to-abs-image.jpg' },
        ]);
      }
    };

    fetchCategoriesData();
  }, []);

  // Handle profile click (redirect to profile page)
  const handleProfileClick = () => {
    router.push('/profile'); // Redirect to profile page
  };

  // Handle category selection (redirect to training page)
const handleCategorySelect = (category) => {
  console.log('Selected category:', category.title);
  router.push('/timer');

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
        className="text-blue-500 hover:text-blue-700 underline" style={{ cursor: 'pointer' }}
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
