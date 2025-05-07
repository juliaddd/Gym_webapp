'use client';

import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Edit, Check, Trash2 } from 'lucide-react';
import ProfileIcon from '@/app/components/profileicon';

export default function UserDetails({
  selectedUser,
  isEditing,
  setIsEditing,
  editableUser,
  setEditableUser,
  showConfirmDelete,
  setShowConfirmDelete,
  setSelectedUserId,
  onSave, // Новый проп для сохранения изменений
  onDelete, // Новый проп для удаления пользователя
}) {
  // Синхронизация editableUser с selectedUser при его изменении
  useEffect(() => {
    if (selectedUser) {
      setEditableUser(selectedUser);
    }
  }, [selectedUser, setEditableUser]);

  if (!selectedUser) {
    return (
      <div className="h-3/5 w-5/5 bg-gray-100 p-4 rounded-xl shadow flexitems-center justify-center text-gray-500  mt-15">
        Select a user for more
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableUser); // Передаём изменённые данные в родительский компонент
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(selectedUser.user_id); // Уведомляем родительский компонент об удалении
    }
    setShowConfirmDelete(false);
    setSelectedUserId(null);
  };

  return (
    <div className="h-3/5 w-5/5 bg-gray-100 p-4 rounded-xl shadow flex flex-col gap-4 overflow-y-auto  mt-15">
      <div className="flex justify-between items-start">
        <ProfileIcon /> {}
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
        {['name', 'surname', 'email', 'phone_number', 'address'].map((field) => (
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
          <InputLabel>Subscription</InputLabel>
          <Select
            name="subscription_type"
            value={editableUser?.subscription_type || ''}
            onChange={handleChange}
            label={editableUser?.subscription_type}
          >
            {['vip', 'standard', 'premium'].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" disabled={!isEditing}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={editableUser?.role || ''}
            onChange={handleChange}
            label={editableUser?.role}
          >
            {['user', 'admin'].map((type) => (
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