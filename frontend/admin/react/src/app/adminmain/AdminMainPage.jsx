'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Search, Filter, Edit, Save, Trash2, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

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
  const [editableUser, setEditableUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const router = useRouter();

  const toggleFilter = (filterSetter, value) => {
    filterSetter((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const filteredUsers = dummyUsers.filter((user) => {
    const roleOk = filterRoles.length === 0 || filterRoles.includes(user.role);
    const subtypeOk = filterSubtypes.length === 0 || filterSubtypes.includes(user.subtype);
    return roleOk && subtypeOk;
  });

  const selectedUser = dummyUsers.find((u) => u.id === selectedUserId);

  const handleEdit = () => {
    setIsEditing(true);
    setEditableUser({ ...selectedUser });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowConfirmDelete(false);
    setSelectedUserId(null);
  };

  return (
    <div className="flex h-screen bg-[#fdf9f3] overflow-hidden">
      {/* Left sidebar with user list and filters */}
      <div className="w-[350px] p-4 border-r border-gray-200 flex flex-col">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-10 py-2 rounded bg-gray-100 text-sm"
          />
          <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
          <Filter
            size={16}
            className="absolute right-2 top-2.5 text-gray-400 cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
          />
          {showFilter && (
            <div className="absolute top-10 left-0 w-full bg-white shadow rounded p-3 text-sm z-10">
              <div className="mb-2 font-semibold">Role</div>
              {['admin', 'user'].map((role) => (
                <div key={role} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filterRoles.includes(role)}
                    onChange={() => toggleFilter(setFilterRoles, role)}
                  />
                  <label>{role}</label>
                </div>
              ))}
              <div className="mt-2 mb-2 font-semibold">Subscription</div>
              {['VIP', 'Standard', 'Premium'].map((type) => (
                <div key={type} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filterSubtypes.includes(type)}
                    onChange={() => toggleFilter(setFilterSubtypes, type)}
                  />
                  <label>{type}</label>
                </div>
              ))}
              <button
                onClick={() => {
                  setFilterRoles([]);
                  setFilterSubtypes([]);
                }}
                className="w-full bg-gray-200 text-black rounded py-1 mt-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push('/add-user')}
          className="mb-4 py-2 bg-[#33b5aa] text-white rounded"
        >
          Add user
        </button>

        <div className="overflow-y-auto flex-1 pr-1">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedUserId(user.id);
                setIsEditing(false);
              }}
              className={`flex items-center gap-2 px-2 py-2 mb-1 rounded cursor-pointer ${
                selectedUserId === user.id ? 'bg-gray-300' : 'bg-gray-200'
              }`}
            >
              <img
                src="/images/user.jpg"
                className="w-6 h-6 rounded-full"
                alt="avatar"
              />
              <span className="text-sm">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side with chart and user details */}
      <div className="flex-1 p-4 flex flex-col items-center gap-4">
        {/* Chart */}
        <div className="h-1/4 w-4/5">
          <Bar data={chartData} options={chartOptions} />
          <div className="text-center mt-2">
            <button className="text-blue-500 underline hover:text-blue-700">
              See full statistics
            </button>
          </div>
        </div>

        {/* User info section */}
        <div className="h-4/5 w-5/5 bg-gray-100 p-4 rounded-xl shadow">
          {!selectedUser ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a user for more
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <img src="/images/user.jpg" alt="Avatar" className="w-20 h-20 rounded-full" />
                <div className="flex gap-2 items-center">
                  {isEditing ? (
                    <Check onClick={handleSave} className="cursor-pointer" />
                  ) : (
                    <Edit onClick={handleEdit} className="cursor-pointer" />
                  )}
                  <Trash2 onClick={() => setShowConfirmDelete(true)} className="cursor-pointer" />
                </div>
              </div>

              {showConfirmDelete && (
                <div className="bg-red-100 p-2 rounded text-red-700">
                  <div className="flex justify-between items-center">
                    <span>Are you sure you want to delete this user?</span>
                    <div className="flex gap-2">
                      <button onClick={handleDelete} className="text-sm bg-red-500 text-white px-2 rounded">Yes</button>
                      <button onClick={() => setShowConfirmDelete(false)} className="text-sm bg-gray-300 px-2 rounded">No</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {['name', 'surname', 'email', 'phone', 'id', 'address', 'city'].map((field) => (
                  <TextField
                    key={field}
                    fullWidth
                    variant="outlined"
                    label={field}
                    value={editableUser?.[field] || selectedUser[field]}
                    onChange={(e) =>
                      setEditableUser((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                ))}

                <FormControl fullWidth variant="outlined" disabled={!isEditing}>
                  <InputLabel>Sub type</InputLabel>
                  <Select
                    value={editableUser?.subtype || selectedUser.subtype}
                    onChange={(e) =>
                      setEditableUser((prev) => ({ ...prev, subtype: e.target.value }))
                    }
                    label="Sub type"
                  >
                    {['VIP', 'Standard', 'Premium'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}







