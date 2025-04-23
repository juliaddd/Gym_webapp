'use client';
import { useState } from 'react';
import InputField from '@/app/components/inputfield'; // Assuming InputField is the file path
import ProfileIcon from '@/app/components/profileicon'; // The ProfileIcon component
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function LoginPage({ onLogin, onForgotPasswordRedirect }) {
  const router = useRouter(); // Next.js useRouter hook for navigation
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setLoginData({
      ...loginData,
      [field]: value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Call the onLogin function passed as prop
    //onLogin(loginData);
    router.push('/');

  };
  const handleSignUpRedirect = () => {
    router.push('/registration');// Redirect to registration page
  };

  

  return (
    <div className="login-page-container">
      <div className="login-form">
        <h2>Welcome to JaenGym!</h2>

      {/* Profile Icon */}
      <div className="profile-icon">
        <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={() => {}} />
      </div>        

        {/* Input Fields */}
        <form onSubmit={handleLoginSubmit}>
          <InputField
            label="Enter login"
            value={loginData.username}
            onChange={handleInputChange}
            name="username"
          />
          <InputField
            label="Enter password"
            type="password"
            value={loginData.password}
            onChange={handleInputChange}
            name="password"
          />

          {/* Forgot password and Sign-Up links */}
          <div className="forgot-signup-links">
            <span onClick={onForgotPasswordRedirect} className="forgot-password">
              Forgot password?
            </span>
            <a onClick={handleSignUpRedirect} style={{ cursor: 'pointer' }}>
             Sign up
            </a>
          </div>

          {/* Submit Button */}
          <Button variant="contained" type="submit">
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}
