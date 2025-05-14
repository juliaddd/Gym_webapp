'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import ProfileIcon from '@/app/components/profileicon';

export default function Sidebar({
  filteredUsers,
  selectedUserId,
  setSelectedUserId,
  setIsEditing,
  showFilter,
  toggleShowFilter,
  filterRoles,
  filterSubtypes,
  toggleFilter,
  clearFilters,
  router,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="w-[350px] p-4 border-r border-gray-200 flex flex-col">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-8 pr-10 py-2 rounded bg-gray-100 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
        <Filter
          size={16}
          className="absolute right-2 top-2.5 text-gray-400 cursor-pointer"
          onClick={toggleShowFilter}
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
                  onChange={() => toggleFilter('role', role)}
                />
                <label>{role}</label>
              </div>
            ))}
            <div className="mt-2 mb-2 font-semibold">Subscription</div>
            {['vip', 'standard', 'premium'].map((type) => (
              <div key={type} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filterSubtypes.includes(type)}
                  onChange={() => toggleFilter('subscription_type', type)}
                />
                <label>{type}</label>
              </div>
            ))}
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 text-black rounded py-1 mt-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => router.push('/adduser')}
        className="mb-4 py-2 bg-[#33b5aa] text-white rounded"
      >
        Add user
      </button>

      <div className="overflow-y-auto flex-1 pr-1">
        {filteredUsers.map((user) => (
          <div
            key={user.user_id}
            onClick={() => {
              setSelectedUserId(user.user_id);
              setIsEditing(false);
            }}
            className={`flex items-center gap-2 px-2 py-2 mb-1 rounded cursor-pointer ${
              selectedUserId === user.user_id ? 'bg-gray-300' : 'bg-gray-200'
            }`}
          >
            <ProfileIcon className="w-6 h-6 rounded-full" />
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}