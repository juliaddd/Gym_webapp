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
  
    return null; // null означает, что всё ок
  }

  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+(\d{1,4})\s?(\d{1,12})(\s?\d{1,2})?$/;
  
    if (!phoneRegex.test(phone)) {
      return "Phone number must start with '+' and contain up to 15 digits total.";
    }
  
    return null; // null означает, что номер валиден
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
  // Собираем данные для отправки
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

  // Handle back button click (navigating to the main page)
  const handleGoBack = () => {
    router.back(); // Go back to the previous page
  };


  return (
    <div className="profile-page">
      {/* Back button */}
      <div className="back-button" onClick={handleGoBack} style={{ cursor: 'pointer', margin: '10px' }}>
        <ArrowBackIcon />
        <span style={{ marginLeft: '5px' }}>Back</span>
      </div>

      <h2>Your Profile </h2>

      {/* Profile Icon */}
      <div className="profile-icon">
        <ProfileIcon userImage="https://example.com/user-avatar.jpg" onClick={() => {}} />
      </div>

      {/* Profile Form */}
      <ProfileForm formData={formData} onChange={handleFormChange} onSaveChanges={handleSaveChanges} />
    </div>
  );
}
