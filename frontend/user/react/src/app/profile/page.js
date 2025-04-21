'use client';
import { useState } from 'react';
import ProfileForm from '@/app/components/profileform'; // The ProfileForm component
import ProfileIcon from '@/app/components/profileicon'; // The ProfileIcon component
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // The back icon from Material UI
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter(); // Next.js useRouter hook for navigation
  const [formData, setFormData] = useState({
    name: 'Karsiaryna',
    surname: 'Dabreha',
    email: 'rybka@gmail.com',
    phone: '+34 731899899',
    address: 'Av. de Minsk',
    city: 'Jaen',
    membershipType: 'Standard',
    password: '********',
    newPassword: '',
    repeatPassword: '',
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = (updatedFormData) => {
    console.log('Form saved with data:', updatedFormData);
    // Here you would typically send data to an API
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
