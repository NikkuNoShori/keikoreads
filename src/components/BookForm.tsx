import { useState, useEffect } from 'react';
import { Book, BookFormData, NewBook } from '../types/BookTypes';

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: NewBook) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const BookForm = ({ initialData, onSubmit, onCancel, isSubmitting }: BookFormProps) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    series: '',
    genre: '',
    publish_date: '',
    pages: undefined,
    rating: 3,
    description: '',
    review: '',
    review_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    cover_image: '',
    goodreads_link: '',
    storygraph_link: '',
    bookshop_link: '',
    barnes_noble_link: '',
    read_alikes_image: ''
  });

  // Populate form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      // Format dates for date inputs (YYYY-MM-DD)
      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
      };

      setFormData({
        ...initialData,
        publish_date: formatDateForInput(initialData.publish_date),
        review_date: formatDateForInput(initialData.review_date)
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Form Title */}
        <h2 className="text-2xl font-semibold mb-6">
          {initialData ? 'Edit Book Review' : 'Add New Book Review'}
        </h2>
        
        {/* Basic Book Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Title */}
          <div className="col-span-2">
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Book Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Enter book title"
            />
          </div>
          
          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Author <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Enter author name"
            />
          </div>
          
          {/* Series */}
          <div>
            <label htmlFor="series" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Series
            </label>
            <input
              type="text"
              id="series"
              name="series"
              value={formData.series || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Book series (if applicable)"
            />
          </div>
          
          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Book genre"
            />
          </div>
          
          {/* Publish Date */}
          <div>
            <label htmlFor="publish_date" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Publication Date
            </label>
            <input
              type="date"
              id="publish_date"
              name="publish_date"
              value={formData.publish_date || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
            />
          </div>
          
          {/* Pages */}
          <div>
            <label htmlFor="pages" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Number of Pages
            </label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={formData.pages || ''}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Number of pages"
            />
          </div>
          
          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Rating <span className="text-rose-600">*</span>
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
            >
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          
          {/* Review Date */}
          <div>
            <label htmlFor="review_date" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Review Date
            </label>
            <input
              type="date"
              id="review_date"
              name="review_date"
              value={formData.review_date || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
            />
          </div>
          
          {/* Cover Image URL */}
          <div className="col-span-2">
            <label htmlFor="cover_image" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Cover Image URL
            </label>
            <input
              type="url"
              id="cover_image"
              name="cover_image"
              value={formData.cover_image || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="URL to book cover image"
            />
          </div>
        </div>
        
        {/* Description and Review */}
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Book Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Brief description or synopsis of the book"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="review" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Your Review
            </label>
            <textarea
              id="review"
              name="review"
              value={formData.review || ''}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              placeholder="Write your review here"
            ></textarea>
          </div>
        </div>
        
        {/* External Links */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">External Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="goodreads_link" className="block text-gray-700 dark:text-gray-300 mb-1">
                Goodreads
              </label>
              <input
                type="url"
                id="goodreads_link"
                name="goodreads_link"
                value={formData.goodreads_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                placeholder="Goodreads URL"
              />
            </div>
            
            <div>
              <label htmlFor="storygraph_link" className="block text-gray-700 dark:text-gray-300 mb-1">
                StoryGraph
              </label>
              <input
                type="url"
                id="storygraph_link"
                name="storygraph_link"
                value={formData.storygraph_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                placeholder="StoryGraph URL"
              />
            </div>
            
            <div>
              <label htmlFor="bookshop_link" className="block text-gray-700 dark:text-gray-300 mb-1">
                Bookshop.org
              </label>
              <input
                type="url"
                id="bookshop_link"
                name="bookshop_link"
                value={formData.bookshop_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                placeholder="Bookshop.org URL"
              />
            </div>
            
            <div>
              <label htmlFor="barnes_noble_link" className="block text-gray-700 dark:text-gray-300 mb-1">
                Barnes & Noble
              </label>
              <input
                type="url"
                id="barnes_noble_link"
                name="barnes_noble_link"
                value={formData.barnes_noble_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                placeholder="Barnes & Noble URL"
              />
            </div>
            
            <div className="col-span-2">
              <label htmlFor="read_alikes_image" className="block text-gray-700 dark:text-gray-300 mb-1">
                Read-Alikes Image URL
              </label>
              <input
                type="url"
                id="read_alikes_image"
                name="read_alikes_image"
                value={formData.read_alikes_image || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                placeholder="URL to read-alikes image"
              />
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Review' : 'Create Review'}
          </button>
        </div>
      </div>
    </form>
  );
}; 