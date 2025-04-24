'use client';
import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import AdminForm from '../components/AdminForm';
import ProfileIcon from '../components/ProfileIcon';

export default function AddUserPage() {
  const [status, setStatus] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    id: '',
    address: '',
    city: '',
    subtype: 'VIP',
    password: ''
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ backgroundColor: '#fdf9f3', minHeight: '100vh', display: 'flex', padding: '20px' }}>
      <div style={{ backgroundColor: '#33b5aa', width: '190px', borderRadius: '10px' }} />
      <div style={{ flex: 1, padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="flex justify-end w-full mb-4">
        </div>
        <h3 style={{ marginBottom: '20px' }}>Add user</h3>
        {status === 'admin' ? (
          <AdminForm formData={formData} handleChange={handleChange} status={status} setStatus={setStatus} />
        ) : (
          <UserForm formData={formData} handleChange={handleChange} status={status} setStatus={setStatus} />
        )}
      </div>
      <div style={{ backgroundColor: '#33b5aa', width: '190px', borderRadius: '10px' }} />
    </div>
  );
}


