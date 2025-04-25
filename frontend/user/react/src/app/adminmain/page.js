'use client';

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import 'chart.js/auto';
import ProfileIcon from '@/app/components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import Sidebar from '../components/Sidebar';
import UserDetails from '../components/UserDetails';


const fetchUsers = async () => {
  const response = await fetch('/api/users');  // Здесь мы делаем запрос к API
  const data = await response.json();
  return data.users || [];  // Возвращаем пользователей, полученных с сервера
};


const dummyUsers = [
  { id: 1, name: 'admin001 V', role: 'admin', subtype: 'VIP', email: 'admin1@example.com' },
  { id: 2, name: 'user002 S', role: 'user', subtype: 'Standard', email: 'user2@example.com' },
  { id: 3, name: 'user003 P', role: 'user', subtype: 'Premium', email: 'user3@example.com' },
  // добавьте больше данных по мере необходимости
];

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.map((category) => ({
      id: category.category_id,
      title: category.name,
      imageUrl: category.image || '/path-to-default-image.jpg',
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [
      { id: 1, title: 'Abs', imageUrl: '/path-to-cardio-image.jpg' },
      { id: 2, title: 'Stretching', imageUrl: '/path-to-stretching-image.jpg' },
      { id: 3, title: 'Back', imageUrl: '/path-to-back-image.jpg' },
      { id: 4, title: 'Arms', imageUrl: '/path-to-arms-image.jpg' },
      { id: 5, title: 'Legs', imageUrl: '/path-to-legs-image.jpg' },
      { id: 6, title: 'Cardio', imageUrl: '/path-to-abs-image.jpg' },
    ];
  }
};

const fetchHoursByCategory = async () => {
  try {
    const response = await fetch('/api/hours-by-category');
    if (!response.ok) {
      throw new Error('Failed to fetch hours by category');
    }
    const data = await response.json();
    return data; // Expected format: [{ category_id: 1, total_hours: 120 }, ...]
  } catch (error) {
    console.error('Error fetching hours:', error);
    return [
      { category_id: 1, total_hours: 120 },
      { category_id: 2, total_hours: 80 },
      { category_id: 3, total_hours: 90 },
      { category_id: 4, total_hours: 110 },
      { category_id: 5, total_hours: 100 },
      { category_id: 6, total_hours: 130 },
    ];
  }
};


const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
};

export default function AdminMainPage() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterRoles, setFilterRoles] = useState([]);
  const [filterSubtypes, setFilterSubtypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const categories = await fetchCategories();
      const hoursData = await fetchHoursByCategory();
      // Map categories to chartData format, matching category_id to total_hours
      const formattedChartData = categories.map((category) => {
        const hoursEntry = hoursData.find((h) => h.category_id === category.id);
        return {
          day_of_week: category.title, // Using category title as label
          total_training_time: hoursEntry ? hoursEntry.total_hours : 0, // Total hours
        };
      });
      setChartData(formattedChartData);
    };
    loadData();
  }, []);

  const toggleShowFilter = () => setShowFilter(!showFilter);

  const toggleFilter = (type, value) => {
    if (type === 'reset') {
      setFilterRoles([]);
      setFilterSubtypes([]);
    } else if (type === 'role') {
      setFilterRoles((prev) => prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]);
    } else if (type === 'subtype') {
      setFilterSubtypes((prev) => prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]);
    }
  };

  const filteredUsers = dummyUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const roleOk = filterRoles.length === 0 || filterRoles.includes(user.role);
    const subtypeOk = filterSubtypes.length === 0 || filterSubtypes.includes(user.subtype);
    return matchesSearch && roleOk && subtypeOk;
  });

  const selectedUser = dummyUsers.find((u) => u.id === selectedUserId);

  return (
    <div className="flex h-screen bg-[#fdf9f3] overflow-hidden">
      <Sidebar
        filteredUsers={filteredUsers}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        setIsEditing={setIsEditing}
        showFilter={showFilter}
        toggleShowFilter={toggleShowFilter}
        filterRoles={filterRoles}
        filterSubtypes={filterSubtypes}
        toggleFilter={toggleFilter}
        clearFilters={() => toggleFilter('reset')}
        router={router}
      />

      <div className="flex-1 p-4 flex flex-col items-center gap-4">
        <div className="h-1/4 w-4/5">
            <StatisticsChart
              data={chartData}
              onClick={() => router.push('/statistics')}
              width="40%"
              height="150px"
            />
            <div className="text-center mt-8">
              <button
                className="text-blue-500 underline hover:text-blue-700"
                onClick={() => router.push('/statistics')}
              >
                See full statistics
              </button>
            </div>
      </div>

        <UserDetails 
          selectedUser={selectedUser}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editableUser={editableUser}
          setEditableUser={setEditableUser}
          showConfirmDelete={showConfirmDelete}
          setShowConfirmDelete={setShowConfirmDelete}
          setSelectedUserId={setSelectedUserId}
        />
      </div>
    </div>
  );
}
