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
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 pt-10 bg-white">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Welcome to JaenGym!
      </h2>

        {/* Profile Icon */}
        <div className="mb-8">
        <ProfileIcon userImage="" onClick={() => {}} />
      </div>


      {/* Input Fields */}
      <div className="w-full max-w-xs flex flex-col gap-[1px]">
        <InputField
          label="Name"
          value={formData.name}
          onChange={handleInputChange}
          variant="filled"
        />
        <InputField
          label="Surname"
          value={formData.surname}
          onChange={handleInputChange}
          variant="filled"
        />
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          variant="filled"
        />
        <InputField
          label="Access code"
          type="password"
          value={formData.accessCode}
          onChange={handleInputChange}
          variant="filled"
          showToggle
        />
        <InputField
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          variant="filled"
          showToggle
        />
      </div>

      {/* Sign up button */}
      <Button
        variant="contained"
        onClick={handleRegister}
        fullWidth
        sx={{
          maxWidth: '300px',
          backgroundColor: '#2CB5A0',
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          paddingY: '10px',
          marginTop: '20px',
          '&:hover': {
            backgroundColor: '#239a89',
          },
        }}
      >
        Sign up
      </Button>

      {/* Log in link */}
      <div className="mt-3 text-sm text-gray-600">
        <span className="mr-1">Already have an account?</span>
        <span
          className="text-gray-800 font-medium cursor-pointer"
          onClick={handleLoginRedirect}
        >
          Log in
        </span>
      </div>
    </div>
  );
}



