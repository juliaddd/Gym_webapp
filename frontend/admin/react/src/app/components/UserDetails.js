'use client';

import React from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Edit, Check, Trash2 } from 'lucide-react';

export default function UserDetails({
  selectedUser,
  isEditing,
  setIsEditing,
  editableUser,
  setEditableUser,
  showConfirmDelete,
  setShowConfirmDelete,
  setSelectedUserId
}) {
  if (!selectedUser) {
    return (
      <div className="h-4/5 w-5/5 bg-gray-100 p-4 rounded-xl shadow flex items-center justify-center text-gray-500">
        Select a user for more
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowConfirmDelete(false);
    setSelectedUserId(null);
  };

  return (
    <div className="h-4/5 w-5/5 bg-gray-100 p-4 rounded-xl shadow flex flex-col gap-4 overflow-y-auto">
      <div className="flex justify-between items-start">
        <img src="/images/user.jpg" alt="Avatar" className="w-20 h-20 rounded-full" />
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <Check onClick={handleSave} className="cursor-pointer" />
          ) : (
            <Edit onClick={() => setIsEditing(true)} className="cursor-pointer" />
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
            name={field}
            fullWidth
            variant="outlined"
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={editableUser?.[field] || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        ))}

        <FormControl fullWidth variant="outlined" disabled={!isEditing}>
          <InputLabel>Sub type</InputLabel>
          <Select
            name="subtype"
            value={editableUser?.subtype || ''}
            onChange={handleChange}
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
  );
}
