'use client';
import { useState, useEffect } from 'react';
import ProfileForm from '@/app/components/profileform'; // The ProfileForm component
import ProfileIcon from '@/app/components/profileicon'; // The ProfileIcon component
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // The back icon from Material UI
import { useRouter } from 'next/navigation';
import { fetchUserById, updateUser } from '../../api'; 

export default function ProfilePage() {
  const router = useRouter(); // Next.js useRouter hook for navigation
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    membershipType: '',
    newPassword: '',
    repeatPassword: '',
  });

  // client side password validation
  function validatePasswordComplexity(password) {
    const minLength = 8;
    const maxLength = 64;
  
    if (password.length < minLength || password.length > maxLength) {
      return `Password must be between ${minLength} and ${maxLength} characters.`;
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one digit.";
    }
  
    return null; // null if everything ok
  }

  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+(\d{1,4})\s?(\d{1,12})(\s?\d{1,2})?$/;
  
    if (!phoneRegex.test(phone)) {
      return "Phone number must start with '+' and contain up to 15 digits total.";
    }
  
    return null; 
  }


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        
        const data = await fetchUserById(userId);
        console.log('Received user data:', data);

        setFormData({
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone_number,
          address: data.address,
          membershipType: data.subscription_type,
          newPassword: '',
          repeatPassword: '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async (updatedFormData) => {
    if (updatedFormData.newPassword !== updatedFormData.repeatPassword) {
      alert('Passwords do not match');
      return;
    }
    
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('User not logged in');
      return;
    }
    const phoneError = validatePhoneNumber(updatedFormData.phone);
    if (phoneError) {
      alert(phoneError);
      return;
    }
    // formating data for sending to server
    const updatedData = {
      name: updatedFormData.name,
      surname: updatedFormData.surname,
      email: updatedFormData.email,
      phone_number: updatedFormData.phone,
      address: updatedFormData.address,
    };
    if (updatedFormData.newPassword) {
      const error = validatePasswordComplexity(updatedFormData.newPassword);
      if (error) {
        alert(error);
        return;
      }
      updatedData.password = updatedFormData.newPassword;
    }
    try {
      const savedUser = await updateUser(userId, updatedData);
      console.log('User updated:', savedUser);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user profile');
    }
  };

  // 
  const handleGoBack = () => {
    router.back(); // go back to the previous page ( not explicit routering)
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
          <h3 style={{ marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>Your Profile</h3>
        </div>
        
        {/* Profile Icon */}
        <div className="profile-icon">
          <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={() => {}} />
        </div>

        {/* Profile Form */}
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <ProfileForm 
            formData={formData} 
            onChange={handleFormChange} 
            onSaveChanges={handleSaveChanges} 
          />
        </div>
      </div>
      
      {/* Right green bar */}
      <div style={{ backgroundColor: '#33b5aa', width: '190px', borderRadius: '10px' }} />
    </div>
  );
}