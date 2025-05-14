'use client';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/adminmain');
  };

  return (
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
  );
}

