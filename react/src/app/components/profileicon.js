'use client';
import { useState } from 'react';

export default function ProfileIcon({ userImage, onClick }) {
  return (
    <div className="relative">
      <button 
        onClick={onClick}
        className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden cursor-pointer focus:outline-none"
      >
        {/* Здесь будет изображение аватара пользователя */}
        <img src="/images/user.jpg" alt="User Avatar" className="w-full h-full object-cover" />
      </button>
    </div>
  );
}
