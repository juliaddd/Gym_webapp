'use client';
import { useState } from 'react';
import InputField from '@/app/components/inputfield'; // Assuming InputField is the file path
import ProfileIcon from '@/app/components/profileicon'; // The ProfileIcon component
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function RegistrationPage({ onRegister, onLoginRedirect }) {
  const router = useRouter(); // Next.js useRouter hook for navigation
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  // Handle change in input fields
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle registration
  const handleRegister = () => {
    // Trigger the onRegister function (pass form data)
    //onRegister(formData);
    router.push('/login');// Redirect to login page
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push('/login');// Redirect to login page
  };

  return (
    <div className="registration-page">
      <h2>Welcome to JaenGym!</h2>

      {/* Profile Icon */}
      <div className="profile-icon">
        <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={() => {}} />
      </div>

      {/* Input fields for registration */}
      <InputField
        label="Name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <InputField
        label="Surname"
        value={formData.surname}
        onChange={handleInputChange}
      />
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
      />

      <InputField
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
      />

      {/* Register button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        Sign up
      </Button>

      {/* Log in link */}
      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        <span>Already have an account? </span>
        <a onClick={handleLoginRedirect} style={{ cursor: 'pointer' }}>
          Log In
        </a>
      </div>
    </div>
  );
}
