import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookForm } from '../components/BookForm';
import { NewBook } from '../types/BookTypes';
import { createBook } from '../utils/bookService';

export const AddReview = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (bookData: NewBook) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data, error } = await createBook(bookData);
      
      if (error) {
        throw error;
      }
      
      // Success! Redirect to the reviews page or the newly created review
      navigate(data?.id ? `/reviews/${data.id}` : '/reviews');
    } catch (err) {
      console.error('Error creating review:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/reviews');
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-4">
      <h1 className="text-3xl font-bold mb-4">Add Book Review</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <BookForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}; 