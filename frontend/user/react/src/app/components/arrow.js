import React from 'react';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const NavigationArrows = ({ onPrevious, onNext }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      {/* Left Arrow (previous) */}
      <IconButton onClick={onPrevious} aria-label="Previous">
        <ArrowBack />
      </IconButton>

      {/* Right Arrow (next) */}
      <IconButton onClick={onNext} aria-label="Next">
        <ArrowForward />
      </IconButton>
    </div>
  );
};

export default NavigationArrows;
