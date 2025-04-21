'use client';
import { useState, useEffect } from 'react';
import ExerciseCard from './exercise'; // Импортируем компонент карточки

export default function CategoryGrid({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Пример загрузки данных (замените на ваш реальный API)
        // const response = await fetch('https://api.example.com/categories');
        // if (!response.ok) {
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        // }
        // const data = await response.json();
        // Для примера будем использовать данные локально
        const data = [
          { id: 1, title: 'Cardio', imageUrl: '/path-to-cardio-image.jpg' },
          { id: 2, title: 'Stretching', imageUrl: '/path-to-stretching-image.jpg' },
          { id: 3, title: 'Back', imageUrl: '/path-to-back-image.jpg' },
          { id: 4, title: 'Arms', imageUrl: '/path-to-arms-image.jpg' },
          { id: 5, title: 'Legs', imageUrl: '/path-to-legs-image.jpg' },
          { id: 6, title: 'Abs', imageUrl: '/path-to-abs-image.jpg' }
        ];
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-md mt-10">
        <p>Error loading categories: {error}</p>
        <p>Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Workout Categories</h1>

      {categories.length === 0 ? (
        <p className="text-gray-600">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <ExerciseCard
              key={category.id}
              title={category.title}
              imageUrl={category.imageUrl}
              onClick={() => onCategorySelect(category)} // Обработчик клика
            />
          ))}
        </div>
      )}
    </div>
  );
}


