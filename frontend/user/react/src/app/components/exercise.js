export default function ExerciseCard({ title, imageUrl, onClick }) {
  return (
    <div
      className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col cursor-pointer"
      onClick={onClick} // Обработчик клика
    >
      {/* Название упражнения */}
      <div className="w-full text-gray-700 dark:text-gray-400">
        <p className="font-medium truncate text-left">{title}</p>
      </div>
      
      {/* Изображение упражнения */}
      <div className="w-full mt-2">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-lg" />
      </div>
    </div>
  );
}
