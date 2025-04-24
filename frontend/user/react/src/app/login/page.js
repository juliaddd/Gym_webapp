'use client';
import { useState } from 'react';
import InputField from '@/app/components/inputfield'; // Assuming InputField is the file path
import ProfileIcon from '@/app/components/profileicon'; // The ProfileIcon component
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { loginUser, fetchUserById } from '../../api';

export default function LoginPage({ onLogin, onForgotPasswordRedirect }) {
  const router = useRouter(); // Next.js useRouter hook for navigation

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setLoginData({
      ...loginData,
      [field]: value,
    });
  };

const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            
            const credentials = {
                email: loginData.username,
                password: loginData.password,
            };

            const result = await loginUser(credentials);
            
            // Save token and user_id in localStorage
            localStorage.setItem('token', result.access_token);
            localStorage.setItem('user_id', result.user_id);
            
            // Если передан onLogin, вызываем его (для обратной совместимости)
            if (onLogin) onLogin(loginData);

            const userData = await fetchUserById(result.user_id);
            if (userData.role == "admin")
              router.push('/');
            else
              router.push('/');
            // Перенаправляем на главную страницу
            
        } catch (err) {
            setError('Failed to login. Check your email and password.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
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

          {/* Сообщение об ошибке */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

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
          <Button variant="contained" type="submit" disabled={loading}>
             {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
