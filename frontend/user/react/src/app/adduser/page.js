'use client';
import { useState } from 'react';
import AddUserForm from '@/app/components/adduser_form'; // Your new component
import ProfileIcon from '@/app/components/profileicon';
import DropdownSelect from '@/app/components/DropdownSelect';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

export default function AddUserPage() {
  const router = useRouter();
  
  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    subscription_type: 'Standard',
    role: 'User',
    password: '',
  });

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle subscription type change
  const handleSubscriptionChange = (event) => {
    handleFormChange('subscription_type', event.target.value);
  };

  // Handle role change
  const handleRoleChange = (event) => {
    handleFormChange('role', event.target.value);
  };

  const subscriptionOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Premium', label: 'Premium' },
    { value: 'VIP', label: 'VIP' }
  ];

  const roleOptions = [
    { value: 'User', label: 'User' },
    { value: 'Admin', label: 'Admin' }
  ];

  // This is the function that will be passed to the form component
  const handleCreateUser = (userData) => {
    // Prepare data for the API
    const newUserData = {
      ...userData,
      subscription_type: formData.subscription_type,
      role: formData.role
    };
    
    console.log('Creating user with data:', newUserData);
    

    setTimeout(() => {
      // Show success message
      alert('User created successfully!');
      
      // Redirect to admin main page
      router.push('/adminmain'); // Replace with your actual route
    }, 500);
  };

  // Go back to previous page
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div style={{ backgroundColor: '#fdf9f3', minHeight: '100vh', display: 'flex', padding: '20px' }}>
      {/* Left green bar */}
      <div style={{ backgroundColor: '#33b5aa', width: '190px', borderRadius: '10px' }} />
      
      {/* Main content */}
      <div style={{ flex: 1, padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Back button and header */}
        <div className="w-full mb-4">
          <div className="back-button cursor-pointer" onClick={handleGoBack} style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowBackIcon />
            <span style={{ marginLeft: '5px' }}>Back</span>
          </div>
          <h3 style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>Add New User</h3>
        </div>
        
        {/* Profile Icon */}
        <div className="profile-icon">
          <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={() => {}} />
        </div>

        {/* User Form with subscription and role selections */}
        <div style={{ width: '100%', maxWidth: '600px' }}>
          {/* Использование компонента DropdownSelect */}
          <DropdownSelect
            id="subscription-type"
            label="Subscription Type"
            value={formData.subscription_type}
            options={subscriptionOptions}
            onChange={handleSubscriptionChange}
          />
          
          <DropdownSelect
            id="role"
            label="Status"
            value={formData.role}
            options={roleOptions}
            onChange={handleRoleChange}
          />
          
          {/* Add User Form with onSubmit prop */}
          <AddUserForm 
            formData={formData} 
            onChange={handleFormChange}
            onSubmit={handleCreateUser}
            buttonText="Create"
          />
        </div>
      </div>
      
      {/* Right green bar */}
      <div style={{ backgroundColor: '#33b5aa', width: '190px', borderRadius: '10px' }} />
    </div>
  );
}