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
    <div
      style={{
        backgroundColor: '#fdf9f3',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '900px',
          height: '500px',
          position: 'relative',
        }}
      >
        {/* Left part */}
        <div
          style={{
            width: '50%',
            padding: '40px 30px',
            backgroundColor: '#fdf9f3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
            Welcome to JaenGym!
          </h3>

          {/* Profile Icon */}
          <div
            className="profile-icon"
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}
          >
            <ProfileIcon
              onClick={() => {}}
              style={{ width: 100, height: 100, borderRadius: '50%' }}
            />
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

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Forgot password and Sign-Up links */}
            <div className="forgot-signup-links flex justify-between text-sm">
              <span
                onClick={onForgotPasswordRedirect}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                Forgot password?
              </span>
              <a onClick={handleSignUpRedirect} style={{ cursor: 'pointer' }}>
              Sign up
              </a>
            </div>

            {/* Submit Button */}
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#33b5aa', border: 'none', marginTop: '20px' }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </div>

        {/* Right part */}
        <div
          style={{
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
            alignItems: 'center',
          }}
        >
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