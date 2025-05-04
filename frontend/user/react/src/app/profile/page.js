'use client';
import { useState, useEffect } from 'react';
import ProfileForm from '@/app/components/profileform'; // The ProfileForm component
import ProfileIcon from '@/app/components/profileicon'; // The ProfileIcon component
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // The back icon from Material UI
import { useRouter } from 'next/navigation';
import { fetchUserById } from '../../api'; 

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
    // Send data to API here
    console.log('Form saved with data:', updatedFormData);
    alert('Changes saved successfully!');
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
