'use client';
import { useState } from 'react';
import AddUserForm from '@/app/components/adduser_form';
import ProfileIcon from '@/app/components/profileicon';
import DropdownSelect from '@/app/components/DropdownSelect';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { createUser } from '../../api'; 


export default function AddUserPage() {
  const router = useRouter();

  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    subscription_type: 'standard',
    role: 'user',
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
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'vip', label: 'VIP' }
  ];

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ];

  // This is the function that will be passed to the form component
  const [serverErrors, setServerErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async (userData) => {
  setIsSubmitting(true);
  setServerErrors({});
  
  try {
    // preparing data for api
    const apiData = {
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      phone_number: userData.phone, 
      address: userData.address || "",
      subscription_type: formData.subscription_type,
      role: formData.role,
      password: userData.password
    };
    
    console.log('Creating user with data:', apiData);
    
    // calling API
    const response = await createUser(apiData);
    console.log('User created successfully:', response);
    
    alert('User created successfully!');
    
    // routing to return to admin main page
    router.push('/adminmain');
  } catch (error) {
    console.error('Error creating user:', error);
    
    // handlong errors
    if (error.message.includes('Email already registered')) {
      setServerErrors({
        email: 'This email is already registered in the system. Please use a different email.'
      });
    } else if (error.message.includes('Phone number')) {
      setServerErrors({
        phone: 'Invalid phone number format. It must start with "+" followed by country code and digits.'
      });
    } else {
      // general error
      setServerErrors({
        general: `Failed to create user: ${error.message}`
      });
      alert(`Error: ${error.message}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};

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
        {serverErrors.general && (
    <Alert severity="error" sx={{ mb: 2 }}>
      {serverErrors.general}
    </Alert>
  )}
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
          
          <AddUserForm 
            formData={formData} 
            onChange={handleFormChange}
            onSubmit={handleCreateUser}
            buttonText="Create"
            disabled={isSubmitting}
            serverErrors={serverErrors}
          />
        </div>
      </div>
      
      {/* Right green bar */}
      <div style={{ backgroundColor: '#33b5aa', width: '190px', borderRadius: '10px' }} />
    </div>
  );
}