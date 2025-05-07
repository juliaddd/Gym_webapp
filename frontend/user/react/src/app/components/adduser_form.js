'use client';
import React, { useState, useEffect } from 'react';
import InputField from './inputfield';
import { Button, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

export default function AddUserForm({ formData, onChange, onSubmit, buttonText = "Create", disabled = false,serverErrors = {}  }) {
  const [userData, setUserData] = useState(formData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUserData(formData);
  }, [formData]);

  useEffect(() => {
    if (Object.keys(serverErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...serverErrors
      }));
    }
  }, [serverErrors]);

  const handleFieldChange = (fieldName, value) => {
    const newData = {
      ...userData,
      [fieldName]: value,
    };
    setUserData(newData);
    onChange(fieldName, value);
  };

  const validatePasswordComplexity = (password) => {
    if (!password) return "Password is required";

    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
      return `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`;
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one digit";
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const requiredFields = ['name', 'surname', 'email', 'phone', 'password'];

    requiredFields.forEach((field) => {
      if (!userData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Добавляем phoneRegex здесь
    const phoneRegex = /^\+(\d{1,4})\s?(\d{1,12})(\s?\d{1,2})?$/;
    if (userData.phone) {
      const phoneErrors = [];
      if (!userData.phone.startsWith('+')) {
        phoneErrors.push("Phone number must start with + (country code)");
      }
      if (userData.phone.length < 10) {
        phoneErrors.push("Phone number is too short. Ensure it includes the country code.");
      }
      if (!phoneRegex.test(userData.phone)) {
        phoneErrors.push("Invalid phone number format. Must start with + followed by country code and number");
      }
      if (phoneErrors.length > 0) {
        newErrors.phone = phoneErrors.join(" ");
      }
    } else if (!newErrors.phone) {
      newErrors.phone = "Phone is required";
    }

    const passwordError = validatePasswordComplexity(userData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(userData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {/* Добавить отображение общей ошибки, если она есть */}
      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}
      <InputField
        label="Name"
        name="name"
        value={userData.name}
        onChange={handleFieldChange}
        required={true}
        error={errors.name}
        helperText={errors.name}
      />
      <InputField
        label="Surname"
        name="surname"
        value={userData.surname}
        onChange={handleFieldChange}
        required={true}
        error={errors.surname}
        helperText={errors.surname}
      />
      <InputField
        label="Email"
        name="email"
        type="text"
        value={userData.email}
        onChange={handleFieldChange}
        required={true}
        error={errors.email}
        helperText={errors.email}
      />
      <InputField
        label="Phone number"
        name="phone"
        type="text"
        value={userData.phone}
        onChange={handleFieldChange}
        required={true}
        error={errors.phone}
        helperText={errors.phone}
      />
      <InputField
        label="Address"
        name="address"
        value={userData.address}
        onChange={handleFieldChange}
        required={false}
        error={errors.address}
        helperText={errors.address}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={userData.password || ''}
        onChange={handleFieldChange}
        required={true}
        error={errors.password}
        helperText={errors.password}
      />

      {errors.password && (
        <Box sx={{ mt: 1, mb: 3, fontSize: '0.875rem', color: 'text.secondary' }}>
          Password must:
          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
            <li>Be between {PASSWORD_MIN_LENGTH} and {PASSWORD_MAX_LENGTH} characters</li>
            <li>Contain at least one uppercase letter</li>
            <li>Contain at least one lowercase letter</li>
            <li>Contain at least one digit</li>
          </ul>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 5 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            textTransform: 'none',
            bgcolor: '#33b5aa',
            '&:hover': {
              bgcolor: '#2a9d93',
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
}