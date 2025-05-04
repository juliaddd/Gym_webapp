'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import timerIcon from '@/app/timericon.png';
import { createTraining } from  '../../api'; 

export default function StartTrainingPage() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLabel, setTimeLabel] = useState('00:00');
  const [intervalId, setIntervalId] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      setCategory(JSON.parse(savedCategory));
    }
  }, []);

  // Format time to MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          setTimeLabel(formatTime(newTime));
          return newTime;
        });
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleSave = async () =>{
    alert(`Recorded time: ${timeElapsed} seconds (${timeLabel})`);
    if ( timeElapsed === 0) {
      alert('Please start a timer');
      return;
    }
    const timeInMinutes = Math.round(timeElapsed / 60);
    try {
      const userId = localStorage.getItem('user_id');
      const categoryId = category.id;
      const date = new Date().toISOString().split('T')[0];
  
      const trainingData = {
        user_id: userId,
        category_id: categoryId,
        date: date,
        training_duration: parseInt(timeInMinutes),
      };
  
      await createTraining(trainingData);
  
      alert(`Training recorded: ${timeInMinutes} min`);
      router.push('/');
    } catch (error) {
      console.error('Error. Could not create training:', error);
      alert('Error. Could not save trainig.');
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
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
        <Image 
          src={timerIcon} 
          alt="Timer" 
          width={100} 
          height={100}
          className="rounded-full mb-4"
        />
        <div className="text-4xl font-mono">{timeLabel}</div>
      </div>

      {/* Timer Control Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {!isRunning ? (
          <Button variant="contained" onClick={startTimer}>
            Start
          </Button>
        ) : (
          <Button variant="contained" color="error" onClick={stopTimer}>
            Stop
          </Button>
        )}
      </div>

      {/* Save Button when timer is stopped */}
      {!isRunning && timeElapsed > 0 && (
        <div className="flex justify-center gap-4">
          <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" onClick={handleBackClick}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}