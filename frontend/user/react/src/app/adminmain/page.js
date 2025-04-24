'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import 'chart.js/auto';
import Sidebar from '../components/Sidebar';
import UserDetails from '../components/UserDetails';

const dummyUsers = Array.from({ length: 30 }).map((_, i) => {
  const role = i % 3 === 0 ? 'admin' : 'user';
  const subtype = i % 3 === 0 ? 'VIP' : i % 3 === 1 ? 'Standard' : 'Premium';
  const shortSubtype = subtype === 'VIP' ? 'V' : subtype === 'Standard' ? 'S' : 'P';
  const name = `${role}${(i + 1).toString().padStart(3, '0')} ${role === 'admin' ? 'A' : shortSubtype}`;
  return {
    id: i + 1,
    name,
    role,
    surname: 'Zajaceva',
    email: `user${i + 1}@example.com`,
    phone: '+34 11111111',
    address: 'Av. de Madrid',
    city: 'Jaen',
    subtype,
  };
});

const chartData = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  datasets: [
    {
      label: 'Users per year',
      backgroundColor: '#33b5aa',
      borderRadius: 5,
      data: [5, 10, 15, 20, 30, 45, 60],
    },
  ],
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
  const router = useRouter();

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
          <Bar data={chartData} options={chartOptions} />
          <div className="text-center mt-2">
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
