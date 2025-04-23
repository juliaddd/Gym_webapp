'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import timerIcon from '@/app/timericon.png';
import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';

export default function StartTrainingPage({ category }) {
  const router = useRouter();


  const handleManualEntry = () => {
    router.push('/timer_manual');
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleStartClick = () => {
    router.push('/timer_on');
  };



  return (
    <div className="container">
      {/* Back Button */}
      <div className="back-button" onClick={handleBackClick} style={{ cursor: 'pointer', margin: '10px' }}>
        <ArrowBackIcon />
        <span style={{ marginLeft: '5px' }}>Back</span>
      </div>

      {/* Training Category */}
      <div className="header">
        <h1>Training</h1>
      </div>
   
      
      {/* Timer Display */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <Image 
            src={timerIcon} 
            alt="Timer" 
            width={100} 
            height={100}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Start and Manual Entry buttons */}
      <div className="buttons">
        <Button
          variant="contained"
          onClick={handleStartClick}
        >
          Start
        </Button>
        <Button
          variant="outlined"
          onClick={handleManualEntry}
        >
          Enter manually
        </Button>
      </div>
    </div>
  );
}