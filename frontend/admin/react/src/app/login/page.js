'use client';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/adminmain');
  };

  return (
    <div style={{
      backgroundColor: '#fdf9f3',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '900px',
        height: '500px',
      }}>
        {/* Left part */}
        <div style={{
          width: '50%',
          padding: '40px 30px',
          backgroundColor: '#fdf9f3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Welcome to JaenGym!</h3>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
            <img
              src="/images/user.jpg"
              alt="Profile"
              style={{ width: 100, height: 100, borderRadius: '50%' }}
            />
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <TextField
                fullWidth
                label="Admin login"
                variant="outlined"
                placeholder="Enter admin login"
              />
            </div>

            <div className="mb-3">
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                placeholder="Enter password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="d-grid">
              <Button type="submit" style={{ backgroundColor: '#33b5aa', border: 'none' }}>
                Log in
              </Button>
            </div>
          </form>
        </div>

        {/* Right part */}
        <div style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '45%',
          height: '95%',
          backgroundColor: '#999',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="/images/gym.png"
            alt="Barbell"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}


