'use client';
import { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import ProfileIcon from '@/app/components/profileicon';  // Используем компонент для отображения аватара
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Иконка для кнопки "Back"

export default function StartTrainingPage({ category, onBack }) {
  const router = useRouter();
  const [manualTime, setManualTime] = useState('');
  const [entryMode, setEntryMode] = useState('manual');
  const [timeLabel, setTimeLabel] = useState('Enter time manually');

  const handleManualTimeChange = (e) => {
    setManualTime(e.target.value);  // Обновляем состояние при изменении данных
  };

  const handleSaveTime = () => {
    if (manualTime) {
      alert(`Time recorded for ${category}: ${manualTime} minutes`);  // Запись времени
      router.push('/');  // Переход на главную страницу после сохранения
    } else {
      alert('Please enter a valid time');
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
