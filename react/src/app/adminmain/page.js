'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
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
  const [serverErrors, setServerErrors] = useState({});

  
  const [user, setUser] = useState({
    avatar: 'https://example.com/user-avatar.jpg',
    name: 'Loading...',
  });

  useEffect(() => {
    // Prevents state updates after component unmounts
      let isMounted = true;
  
      // Load current user data from localStorage and API
      const loadUser = async () => {
        try {
          const userId = localStorage.getItem('user_id');
          const token = localStorage.getItem('token');
  

          // Redirect to login if no auth data
          if (!userId || !token) {
            router.push('/');
            return;
          }
  
          const userData = await fetchUserById(userId);
          setUser({
            avatar: userData.avatar || 'https://example.com/user-avatar.jpg',
            name: `${userData.name} ${userData.surname || ''}`.trim(),
          });
  
          // Only update if component is still mounted
          if (isMounted) setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          router.push('/');
        }
      };

      const loadStatData = async () => {
        // Get all-time stats (from 2000 to today)
        const allTimeFrom = '2000-01-01';
        const today = new Date().toISOString().split('T')[0];

        const data = await fetchStatsByCategory(null, allTimeFrom, today);
        const allCategories = await fetchCategories() || [];

        // Transform data: combine categories with their stats
        const transformedData = allCategories.map(category => {
        const categoryData = data.find(item => item.category_id === category.category_id);
        return {
          category_name: category.name,
          total_training_time: categoryData ? categoryData.total_training_time : 0,
        };
        });

        // Format data for chart (reusing day_of_week field for category names)
        setChartData(
          transformedData.map(item => ({
          day_of_week: item.category_name, //repurpose field for category names
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
    }, []); // Empty dependency array = run once on mount


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

  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+(\d{1,4})\s?(\d{1,12})(\s?\d{1,2})?$/;  
    if (!phoneRegex.test(phone)) {
      return "Phone number must start with '+' and contain up to 15 digits total.";
    }
  
    return null; // null if number is valid
  }
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };


  const handleSaveUser = async (updatedUser) => {
    setServerErrors({});
    try {
      // client side validation 
      if (!isValidEmail(updatedUser.email)) {
        setServerErrors({ email: 'Please enter valid email (ex: user@example.com)' });
        return;
      }
      
      const phoneError = validatePhoneNumber(updatedUser.phone_number);
      if (phoneError) {
        setServerErrors({ phone_number: phoneError });
        return;
      }
      
      const savedUser = await updateUser(updatedUser.user_id, updatedUser);
  
      // updating view
      setUsersData((prev) =>
        prev.map((user) =>
          user.user_id === savedUser.user_id ? savedUser : user
        )
      );
  
      setIsEditing(false);
    } catch (error) {
      console.error('Error. Could not update user data:', error);
      
      console.log('Error:', JSON.stringify(error));
      
      // handling server errors
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.detail && errorData.detail.includes('Duplicate entry') && errorData.detail.includes('unique_email')) {
          setServerErrors({ 
            email: 'This email is already registered in the system. Please use a different email.',
            general: 'Failed to update user: Email already exists' 
          });
        } else if (errorData.message) {
          setServerErrors({ general: errorData.message });
        } else {
          setServerErrors({ general: `Failed to update user: ${error.message || 'Unknown error'}` });
        }
      } else if (error.message && error.message.includes('Duplicate entry') && error.message.includes('unique_email')) {
        setServerErrors({ 
          email: 'This email is already registered in the system. Please use a different email.',
          general: 'Failed to update user: Email already exists' 
        });
      } else {
        // general error
        setServerErrors({ 
          general: `Failed to update user: ${error.message || 'Unknown error'}` 
        });
      }
    }
  };
  
  // deleting error
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
            units="hours"
            onClick={() => router.push('/statisticsadmin')}
            width="40%"
            height="150px"
          />
          <div className="text-center mt-8">
            <button
              className="text-blue-500 underline hover:text-blue-700"
              onClick={() => router.push('/statisticsadmin')}
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
          serverErrors={serverErrors} 
        />
      </div>
    </div>
  );
}