'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ProfileIcon from '@/app/components/profileicon';
import StatisticsChart from '@/app/components/statisticschart';
import Sidebar from '../components/Sidebar';
import UserDetails from '../components/UserDetails';
import { fetchUserById, fetchCategories, fetchStatsByCategory, updateUser , fetchUsers, deleteUser } from '../../api'; 



const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
};

export default function AdminMainPage() {

  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterRoles, setFilterRoles] = useState([]);
  const [filterSubtypes, setFilterSubtypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  
  const [user, setUser] = useState({
    avatar: 'https://example.com/user-avatar.jpg',
    name: 'Loading...',
  });

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
            avatar: userData.avatar || 'https://example.com/user-avatar.jpg',
            name: `${userData.name} ${userData.surname || ''}`.trim(),
          });
  
          if (isMounted) setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          router.push('/login');
        }
      };

      const loadStatData = async () => {
        const allTimeFrom = '2000-01-01';
        const today = new Date().toISOString().split('T')[0];

        const data = await fetchStatsByCategory(null, allTimeFrom, today);
        const allCategories = await fetchCategories() || [];

        const transformedData = allCategories.map(category => {
        const categoryData = data.find(item => item.category_id === category.category_id);
        return {
          category_name: category.name,
          total_training_time: categoryData ? categoryData.total_training_time : 0,
        };
        });

        setChartData(
          transformedData.map(item => ({
          day_of_week: item.category_name, // подсовываем в поле, которое ожидает график
          total_training_time: item.total_training_time,
        })));

      };

      const loadUsers = async () => {
        const data = await fetchUsers();
        setUsersData(data);
      };


      loadUsers();
      loadStatData();
      loadUser();
  
      return () => { isMounted = false; };
    }, []);


  const toggleShowFilter = () => setShowFilter(!showFilter);

  const toggleFilter = (type, value) => {
    if (type === 'reset') {
      setFilterRoles([]);
      setFilterSubtypes([]);
    } else if (type === 'role') {
      setFilterRoles((prev) => (prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]));
    } else if (type === 'subscription_type') {
      setFilterSubtypes((prev) => (prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]));
    }
  };

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const roleOk = filterRoles.length === 0 || filterRoles.includes(user.role);
    const subtypeOk = filterSubtypes.length === 0 || filterSubtypes.includes(user.subscription_type);
    return matchesSearch && roleOk && subtypeOk;
  });

  const selectedUser = usersData.find((u) => u.user_id === selectedUserId);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  // Обработчик сохранения изменений пользователя
  const handleSaveUser = async (updatedUser) => {
    try {
      if (!isValidEmail(updatedUser.email)) {
        alert('Please enter valid email (ex: user@example.com)');
        return;
      }
      const savedUser = await updateUser(updatedUser.user_id, updatedUser);
  
      setUsersData((prev) =>
        prev.map((user) =>
          user.user_id === savedUser.user_id ? savedUser : user
        )
      );
  
      setIsEditing(false);
    } catch (error) {
      console.error('Error. Could not update user data:', error);
    }
  };

  // Обработчик удаления пользователя
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsersData((prev) => prev.filter((user) => user.user_id !== userId));
      setSelectedUserId(null);
    } catch (error) {
      alert('Error. Could not delete user');
    }
  };

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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  );
}