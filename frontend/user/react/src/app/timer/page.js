'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';
import timerIcon from '@/app/timericon.png';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';

export default function StartTrainingPage({ category, onBack }) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [manualTime, setManualTime] = useState(0);
  const [entryMode, setEntryMode] = useState('timer');
  const [timeLabel, setTimeLabel] = useState('Time elapsed: 0s');

  const startTimer = () => {
    setIsRunning(true);
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      if (!isRunning) {
        clearInterval(intervalId);
      }
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      setTimeLabel(`Time elapsed: ${Math.floor((Date.now() - startTime) / 1000)}s`);
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const handleManualEntry = () => {
    setEntryMode('manual');
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleStartClick = () => {
    router.push('/timer_on');
  };

  const handleSaveTime = () => {
    const recordedTime = entryMode === 'manual' ? manualTime : timeElapsed;
    alert(`Recorded time: ${recordedTime} seconds`);
  };

  return (
    <div className="container">
      {/* Back Button */}
      <div className="back-button" onClick={handleBackClick} style={{ cursor: 'pointer', margin: '10px' }}>
        <ArrowBackIcon />
        <span style={{ marginLeft: '5px' }}>Back</span>
      </div>

      {/* Training Category */}
      <h1>{category}</h1>
      
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
          onClick={startTimer}
          disabled={isRunning}
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