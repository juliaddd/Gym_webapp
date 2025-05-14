'use client';
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

export default function DropdownSelect({ 
  id, 
  label, 
  value, 
  options, 
  onChange, 
  sx = { mb: 3 }
}) {
  return (
    <Box sx={sx}>
      <FormControl fullWidth>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value}
          label={label}
          onChange={onChange}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}