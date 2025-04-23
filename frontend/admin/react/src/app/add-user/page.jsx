'use client';
import React, { useState } from 'react';
import UserForm from './UserForm';
import AdminForm from './AdminForm';

export default function AddUserPage() {
  const [status, setStatus] = useState('user');

  return (
    <div style={{ backgroundColor: '#fdf9f3', minHeight: '100vh', display: 'flex', padding: '20px' }}>
      <div style={{ backgroundColor: '#33b5aa', width: '190px', borderRadius: '10px' }} />
      <div style={{ flex: 1, padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ margin: '20px 0' }}>Add user</h3>
        {status === 'admin' ? (
          <AdminForm status={status} setStatus={setStatus} />
        ) : (
          <UserForm status={status} setStatus={setStatus} />
        )}
      </div>
      <div style={{ backgroundColor: '#33b5aa', width: '190px', borderRadius: '10px' }} />
    </div>
  );
}


