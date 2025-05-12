'use client';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import timerIcon from '@/app/timericon.png';
import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function StartTrainingPage() {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  
  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      setCategory(JSON.parse(savedCategory));
    }
  }, []);

  const handleManualEntry = () => {
    router.push('/timer_manual');
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handleStartClick = () => {
    router.push('/timer_on');
  };



  
  return (
    <div className="min-h-screen w-full bg-[#fdf9f3] flex flex-col items-center justify-center px-4 pt-12 relative">

      {/* Back button */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-4 text-gray-600"
      >
        <ArrowBackIcon />
      </button>

      {/* Category title (повышен вверх и центрирован) */}
      <h2 className="absolute top-16 left-1/2 transform -translate-x-1/2 text-gray-800 text-xl font-bold">
        {category?.name || category || 'Cardio'}
      </h2>

      {/* Timer Icon */}
      <Image
        src={timerIcon}
        alt="Timer"
        width={140}
        height={140}
        className="mb-10"
      />

      {/* Start Button */}
      <Button
        variant="contained"
        onClick={handleStartClick}
        fullWidth
        sx={{
          maxWidth: '300px',
          backgroundColor: '#2CB5A0',
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          paddingY: '10px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#239a89',
            boxShadow: 'none',
          },
          marginBottom: '20px',
          marginTop: '30px',
        }}
      >
        Start
      </Button>

      {/* Manual Entry Button */}
      <Button
        variant="outlined"
        onClick={handleManualEntry}
        fullWidth
        sx={{
          maxWidth: '300px',
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          paddingY: '10px',
          borderColor: '#B0B0B0',
          color: '#444',
          '&:hover': {
            borderColor: '#999',
            backgroundColor: '#f9f9f9',
          },
        }}
      >
        Enter manually
      </Button>
    </div>
  );
}
