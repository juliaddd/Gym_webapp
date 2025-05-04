'use client';
import { useEffect, useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';  // Используем компонент для отображения аватара
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Иконка для кнопки "Back"
import { createTraining } from  '../../api'; 

export default function StartTrainingPage({onBack }) {
  const router = useRouter();
  const [manualTime, setManualTime] = useState('');
  const [entryMode, setEntryMode] = useState('manual');
  const [timeLabel, setTimeLabel] = useState('Enter time manually');
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      setCategory(JSON.parse(savedCategory));
    }
  }, []);
  const handleManualTimeChange = (e) => {
    setManualTime(e.target.value);  // Обновляем состояние при изменении данных
  };

  const handleSaveTime = async () => {
    if (!manualTime || isNaN(manualTime) || manualTime <= 0) {
      alert('Please enter a valid time');
      return;
    }
  
    try {
      const userId = localStorage.getItem('user_id');
      const categoryId = category.id;
      const date = new Date().toISOString().split('T')[0];
  
      const trainingData = {
        user_id: userId,
        category_id: categoryId,
        date: date,
        training_duration: parseInt(manualTime),
      };
  
      await createTraining(trainingData);
  
      alert(`Training recorded: ${manualTime} min`);
      router.push('/');
    } catch (error) {
      console.error('Error. Could not create training:', error);
      alert('Error. Could not save trainig.');
    }
  };

  const handleCancel = () => {
    router.push('/');  // Переход к главной странице при отмене
  };

  const handleBackClick = () => {
    router.back();  // Вернуться на предыдущую страницу
  };

  return (
    <div className="container">
      {/* Back Button */}
      <div className="back-button" onClick={handleBackClick} style={{ cursor: 'pointer', margin: '10px' }}>
        <ArrowBackIcon />
        <span style={{ marginLeft: '5px' }}>Back</span>
      </div>


      {/* Manual Time Input Section */}
      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
        <TextField
          label="Enter time (in minutes)"
          type="number"
          value={manualTime}
          onChange={handleManualTimeChange}
          fullWidth
          margin="normal"
        />

        {/* Buttons for Save and Cancel */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            onClick={handleSaveTime}
            color="primary"
            disabled={!manualTime}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            color="secondary"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </div>
  );
}
