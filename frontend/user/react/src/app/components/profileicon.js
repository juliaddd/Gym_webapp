'use client';
import { useState } from 'react';

export default function ProfileIcon({ userImage, onClick }) {
  return (
    <div className="relative">
      <button 
        onClick={onClick}
        className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 cursor-pointer focus:outline-none"
      >
        {/* Здесь будет изображение аватара пользователя */}
        <img src={userImage} alt="User Avatar" className="w-full h-full object-cover" />
      </button>
    </div>
  );
}
