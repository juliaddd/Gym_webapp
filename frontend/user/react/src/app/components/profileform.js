'use client';
import React, { useState, useEffect } from 'react';
import InputField from './inputfield';
import { TextField } from '@mui/material';
import { Button, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export default function ProfileForm({ formData, onChange, onSaveChanges }) {
  const [editedData, setEditedData] = useState(formData);


  useEffect(() => {
    setEditedData(formData);
  }, [formData]);

  const handleFieldChange = (fieldName, value) => {
    const newData = {
      ...editedData,
      [fieldName]: value
    };
    setEditedData(newData);
    onChange(fieldName, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveChanges(editedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <InputField
        label="Name"
        name="name"
        value={editedData.name}
        onChange={handleFieldChange}
        required={true}
      />
      <InputField
        label="Surname"
        name="surname"
        value={editedData.surname}
        onChange={handleFieldChange}
        required={true}
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={editedData.email}
        onChange={handleFieldChange}
        required={true}
      />
      <InputField
        label="Phone number"
        name="phone"
        value={editedData.phone}
        onChange={handleFieldChange}
        required={true}
      />
      <InputField
        label="Address"
        name="address"
        value={editedData.address}
        onChange={handleFieldChange}
        required={false}
      />
      <InputField
        label="Membership Type"
        name="membershipType"
        value={editedData.membershipType}
        onChange={handleFieldChange}
        required={false}
        readOnly={true}
      />
      <InputField
        label="New password"
        name="newPassword"
        type="password"
        value={editedData.newPassword}
        onChange={handleFieldChange}
        required={false}
      />
      <InputField
        label="Repeat password"
        name="repeatPassword"
        type="password"
        value={editedData.repeatPassword}
        onChange={handleFieldChange}
        required={false}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            textTransform: 'none'
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}