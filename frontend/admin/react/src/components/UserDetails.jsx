'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, Check } from 'lucide-react';

export default function UserDetails({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = () => {
    console.log('Saved:', editedUser); // Здесь можно будет сделать запрос
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md relative">
      {/* Иконки */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isEditing ? (
          <Check className="cursor-pointer" onClick={handleSave} />
        ) : (
          <Pencil className="cursor-pointer" onClick={toggleEdit} />
        )}
        <Trash2 className="cursor-pointer" />
      </div>

      <div className="flex gap-4 mb-4">
        <img
          src="/images/user.jpg"
          alt="avatar"
          className="w-20 h-20 rounded-full bg-gray-300"
        />
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              name="name"
              value={editedUser.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded px-2 py-1 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Surname</label>
            <input
              name="surname"
              value={editedUser.surname || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded px-2 py-1 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              value={editedUser.email || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded px-2 py-1 text-sm bg-white"
            />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="text-sm text-gray-600">Phone prefix</label>
              <input
                name="phonePrefix"
                value={editedUser.phonePrefix || '+34'}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-16 rounded px-2 py-1 text-sm bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">Phone number</label>
              <input
                name="phone"
                value={editedUser.phone || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded px-2 py-1 text-sm bg-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">ID</label>
            <input
              name="id"
              value={editedUser.id}
              disabled
              className="w-full rounded px-2 py-1 text-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Address</label>
            <input
              name="address"
              value={editedUser.address || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded px-2 py-1 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">City</label>
            <input
              name="city"
              value={editedUser.city || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded px-2 py-1 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Sub type</label>
            <input
              name="subType"
              value={editedUser.subType || ''}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full rounded px-2 py-1 text-sm bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
