'use client';
import { useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import CategoryGrid from '@/app/components/categorygrid';
import { fetchUserById, fetchStatsByDayOfWeek, fetchCategories } from '../../api'; 

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
          router.push('/');
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
        router.push('/');
      }
    };

    loadUser();

    return () => { isMounted = false; };
  }, [router]);

  // Define basic statistics data 
  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found in localStorage');
        }

      // current day of week
      const today = new Date();
      const dayOfWeek = today.getDay(); // sunday — 0, monday — 1
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // if sun - go 6 days back
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      // to get sunday we add 6 to monday
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      // convert to strings
      const dateFrom = monday.toISOString().split('T')[0];
      const dateTo = sunday.toISOString().split('T')[0];
      const stats = await fetchStatsByDayOfWeek(userId, dateFrom, dateTo);


        setStatistics(stats);
        console.log('Formatted Stats for Chart:', stats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // dummy
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
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();

        const defaultImagePaths = {
          'Abs': '/images/abs.png',
          'Stretching': '/images/stretching.png',
          'Back': '/images/back.png',
          'Arms': '/images/arms.png',
          'Legs': '/images/legs.png',
          'Cardio': '/images/cardio.png',
        };

        const formattedCategories = categoriesData.map((category) => ({
          id: category.category_id,
          title: category.name,
          imageUrl: category.image || defaultImagePaths[category.name] || 
          '/images/default.png',
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([
          { id: 1, title: 'Abs', imageUrl: '/images/abs.png' },
          { id: 2, title: 'Stretching', imageUrl: '/images/stretching.png' },
          { id: 3, title: 'Back', imageUrl: '/images/back.png' },
          { id: 4, title: 'Arms', imageUrl: '/images/arms.png' },
          { id: 5, title: 'Legs', imageUrl: '/images/legs.png' },
          { id: 6, title: 'Cardio', imageUrl: '/images/cardio.png' },
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
  localStorage.setItem('selectedCategory', JSON.stringify(category));
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
        <StatisticsChart data={statistics} units="minutes"/>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleStatisticsClick}
            className="text-black bg-transparent border border-black px-4 py-2 rounded hover:bg-gray-100"
            style={{ cursor: 'pointer' }}
          >
            See full statistics
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="my-8">
        <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
      </div>
    </div>
  );
}
