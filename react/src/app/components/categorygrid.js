'use client';
import { useState, useEffect } from 'react';
import ExerciseCard from './exercise';

export default function CategoryGrid({categories, onCategorySelect }) {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Workout Categories</h1>

      {categories.length === 0 ? (
        <p className="text-gray-600">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <ExerciseCard
              key={category.id}
              title={category.title}
              imageUrl={category.imageUrl}
              onClick={() => onCategorySelect(category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}


