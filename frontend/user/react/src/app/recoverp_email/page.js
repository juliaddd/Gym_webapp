'use client';
import { useState } from 'react';
import InputField from '@/app/components/inputfield'; // Assuming InputField is the file path
import ProfileIcon from '@/app/components/profileicon'; // The ProfileIcon component
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function Recoverp_email_Page({ onLogin, onForgotPasswordRedirect }) {
  const router = useRouter(); // Next.js useRouter hook for navigation
  const [email, setEmail] = useState('');

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSendCode(email); // Trigger the onSendCode function passed as prop
  };


  

   return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl text-center mb-4">Recover password</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            className="mt-4"
          >
            Send code
          </Button>
        </form>
      </div>
    </div>
  );
}

