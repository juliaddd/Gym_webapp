
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
   <div className="min-h-screen w-full bg-[#fdf9f3] flex flex-col items-center justify-center px-4 pt-12 relative">


     {/* Back Button */}
     <button
       onClick={handleBackClick}
       className="absolute top-4 left-4 text-gray-600"
     >
       <ArrowBackIcon />
     </button>


     {/* Category title */}
      {category && (
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          {category}
        </Typography>
      )}


     {/* Timer */}
     <div className="text-6xl font-mono text-gray-800 mb-12 mt-10">
       {timeLabel}
     </div>


     {/* Buttons */}
     {isRunning ? (
       <>
         <Button
           variant="contained"
           onClick={stopTimer}
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
             },
             marginBottom: '20px',
           }}
         >
           Stop
         </Button>
         <Button
           variant="outlined"
           onClick={handleBackClick}
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
           Cancel
         </Button>
       </>
     ) : timeElapsed > 0 ? (
       <>
         <Button
           variant="contained"
           onClick={handleSave}
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
             },
             marginBottom: '20px',
           }}
         >
           Save
         </Button>
         <Button
           variant="outlined"
           onClick={startTimer}
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
           Continue
         </Button>
       </>
     ) : (
       <Button
         variant="contained"
         onClick={startTimer}
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
           },
         }}
       >
         Start
       </Button>
     )}
   </div>
 );
}



