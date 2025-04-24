'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from './components/profileicon';
import StatisticsChart from './components/statisticschart';
import CategoryGrid from './components/categorygrid';
import { fetchUserById, fetchStatsByDayOfWeek, fetchCategories } from '../api'; 

export default function UserMainPage() {
  const router = useRouter(); // Next.js useRouter hook for navigation
  // Define a basic user object for the layout CHANGE LATER
  const [user, setUser] = useState({
    avatar: 'https://example.com/user-avatar.jpg', // Заглушка на случай, если данные не загрузились
    name: 'Loading...',
  });

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('user_id'); // Получаем user_id из localStorage
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

        const token = localStorage.getItem('token'); // Получаем токен
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const userData = await fetchUserById(userId); // Запрашиваем данные пользователя
        setUser({
          avatar: userData.avatar || 'https://example.com/user-avatar.jpg', // Если аватар не указан
          name: `${userData.name} ${userData.surname || ''}`.trim(),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Если ошибка, можно перенаправить на страницу логина
        router.push('/login');
      }
    };

      fetchUserData();
  }, [router]);




  // Define basic statistics data 
  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

        // Задаём диапазон дат (например, последние 7 дней)
        const today = new Date();
        const dateTo = today.toISOString().split('T')[0]; // Сегодня в формате YYYY-MM-DD
        const dateFrom = new Date(today.setDate(today.getDate() - 7))
          .toISOString()
          .split('T')[0]; // 7 дней назад

        const stats = await fetchStatsByDayOfWeek(userId, dateFrom, dateTo);
        // Приводим данные к формату, который ожидает StatisticsChart
        const formattedStats = stats.map((stat) => ({
          day: stat.day_of_week,
          value: stat.total_time,
        }));
        setStatistics(formattedStats);
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
          { id: 1, title: 'Cardio', imageUrl: '/path-to-cardio-image.jpg' },
          { id: 2, title: 'Stretching', imageUrl: '/path-to-stretching-image.jpg' },
          { id: 3, title: 'Back', imageUrl: '/path-to-back-image.jpg' },
          { id: 4, title: 'Arms', imageUrl: '/path-to-arms-image.jpg' },
          { id: 5, title: 'Legs', imageUrl: '/path-to-legs-image.jpg' },
          { id: 6, title: 'Abs', imageUrl: '/path-to-abs-image.jpg' },
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
