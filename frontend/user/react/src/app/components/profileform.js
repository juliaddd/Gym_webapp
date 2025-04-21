'use client';
import React, { useState } from 'react';
import InputField from './inputfield'; // Import your InputField component

export default function ProfileForm({ formData, onChange }) {
  const [editedData, setEditedData] = useState(formData);

  // Handle change for each field
  const handleFieldChange = (field, value) => {
    const newData = {
      ...editedData,
      [field]: value
    };
    setEditedData(newData);
    onChange(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveChanges(editedData);
  };

  return (
    <div className="profile-form">

      <form>
        {/* Editable fields */}
        <InputField
          label="Name"
          value={editedData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
        />
        <InputField
          label="Surname"
          value={editedData.surname}
          onChange={(e) => handleFieldChange('surname', e.target.value)}
        />
        <InputField
          label="Email"
          type="email"
          value={editedData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
        />
        <InputField
          label="Phone number"
          value={editedData.phone}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
        />
        <InputField
          label="Address"
          value={editedData.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
        />
        <InputField
          label="City"
          value={editedData.city}
          onChange={(e) => handleFieldChange('city', e.target.value)}
        />
        <InputField
          label="Membership Type"
          value={editedData.membershipType}
          onChange={(e) => handleFieldChange('membershipType', e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={editedData.password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
        />
        <InputField
          label="New password"
          type="password"
          value={editedData.newPassword}
          onChange={(e) => handleFieldChange('password', e.target.value)}
        />
        <InputField
          label="Repeat password"
          type="password"
          value={editedData.repeatPassword}
          onChange={(e) => handleFieldChange('password', e.target.value)}
        />
        
        <button 
          type="submit" 
          className="save-button"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Save Changes
        </button>

      </form>
    </div>
  );
}
