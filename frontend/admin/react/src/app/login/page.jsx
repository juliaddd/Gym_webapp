'use client';
import React from 'react';
import Login from './Login';

export default function LoginPage() {
  return (
    <div style={{
      backgroundColor: '#fdf9f3',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Login />
    </div>
  );
}

