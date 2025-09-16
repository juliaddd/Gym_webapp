import { useState } from 'react';
import Image from 'next/image';


export default function ExerciseCard({ title, imageUrl, onClick }) {
  const [imageError, setImageError] = useState(false);

  const defaultImage = '/images/default.png';
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="relative max-w-sm rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
      onClick={onClick}
    >
      <div className="w-full overflow-hidden" style={{ height: '250px' }}>
        <Image 
          src={imageError ? defaultImage : imageUrl} 
          alt={title} 
          width={250}
          height={250}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110" 
          onError={handleImageError}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-bold text-white text-center text-lg">
            {title}
          </p>
        </div>
      </div>
    </div>
    
  );
}