import { useState, useEffect } from 'react';
import { Book, BookFormData, NewBook } from '../types/BookTypes';
import { uploadImage } from '../utils/imageUpload';
import { DatePicker } from './DatePicker';

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

  // Add state for date objects
  const [publishDate, setPublishDate] = useState<Date | null>(null);
  const [reviewDate, setReviewDate] = useState<Date | null>(new Date());

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Populate form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      // Format dates for date inputs (YYYY-MM-DD)
      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return null;
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? null : d;
      };

      setFormData({
        ...initialData,
        publish_date: initialData.publish_date || '',
        review_date: initialData.review_date || new Date().toISOString().split('T')[0]
      });

      // Set date states
      setPublishDate(formatDateForInput(initialData.publish_date));
      setReviewDate(formatDateForInput(initialData.review_date) || new Date());
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

  // Handle date changes
  const handlePublishDateChange = (date: Date | null) => {
    setPublishDate(date);
    setFormData(prev => ({
      ...prev,
      publish_date: date ? date.toISOString().split('T')[0] : ''
    }));
  };

  const handleReviewDateChange = (date: Date | null) => {
    setReviewDate(date);
    setFormData(prev => ({
      ...prev,
      review_date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files && e.target.files[0];
    if (selected) {
      // Check file type
      if (!selected.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      // Check file size (max 5MB)
      if (selected.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setFile(selected);
      setFormData({ ...formData, cover_image: '' }); // Clear URL if file selected
    } else {
      setFile(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let coverImageUrl = formData.cover_image;
      
      // Upload new image if selected
      if (file) {
        const uploadedUrl = await uploadImage(file, 'covers/');
        if (!uploadedUrl) {
          throw new Error('Failed to upload image');
        }
        coverImageUrl = uploadedUrl;
      }

      // Submit form data with image URL
      await onSubmit({ ...formData, cover_image: coverImageUrl });
      setFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 p-4 text-base bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">
            Book Title <span className="text-maroon-card">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text"
            placeholder="Enter book title"
          />
        </div>
        {/* Author */}
        <div>
          <label htmlFor="author" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">
            Author <span className="text-maroon-card">*</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text"
            placeholder="Enter author name"
          />
        </div>
        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text"
            placeholder="Book genre"
          />
        </div>
        {/* Publish Date */}
        <div>
          <label htmlFor="publish_date" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">Publish Date</label>
          <DatePicker
            selected={publishDate}
            onChange={handlePublishDateChange}
            name="publish_date"
            placeholder="Select publish date"
            maxDate={new Date()}
          />
        </div>
        {/* Pages */}
        <div>
          <label htmlFor="pages" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">Pages</label>
          <input
            type="number"
            id="pages"
            name="pages"
            value={formData.pages || ''}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text"
            placeholder="Number of pages"
          />
        </div>
        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">Rating <span className="text-maroon-card">*</span></label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text"
          >
            {Array.from({ length: 9 }, (_, i) => 1 + i * 0.5).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
        {/* Review Date */}
        <div>
          <label htmlFor="review_date" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">Review Date</label>
          <DatePicker
            selected={reviewDate}
            onChange={handleReviewDateChange}
            name="review_date"
            placeholder="Select review date"
            maxDate={new Date()}
          />
        </div>
        {/* Cover Image */}
        <div>
          <label htmlFor="cover_image" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">Cover Image</label>
          <div className="flex flex-col w-full">
            <input
              type="file"
              id="cover_image_file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="w-full text-base mb-1"
            />
            {file && (
              <div className="w-full break-words mt-1 text-xs text-gray-700 dark:text-maroon-text">{file.name}</div>
            )}
          </div>
        </div>
      </div>
      {/* Description and Review */}
      <div className="mt-2 space-y-2">
        <div>
          <label htmlFor="description" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text"
            placeholder="Brief description or synopsis of the book"
          ></textarea>
        </div>
        <div>
          <label htmlFor="review" className="block font-medium mb-2 text-base text-gray-700 dark:text-maroon-text">Review</label>
          <textarea
            id="review"
            name="review"
            value={formData.review || ''}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text"
            placeholder="Your thoughts on the book"
          ></textarea>
        </div>
      </div>
      {/* More Options */}
      <details className="mt-2">
        <summary className="cursor-pointer text-maroon-card text-sm font-semibold mb-1">More Options</summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-maroon-text">Goodreads Link</label>
            <input name="goodreads_link" value={formData.goodreads_link} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text" placeholder="Goodreads URL" />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-maroon-text">Storygraph Link</label>
            <input name="storygraph_link" value={formData.storygraph_link} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text" placeholder="StoryGraph URL" />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-maroon-text">Bookshop Link</label>
            <input name="bookshop_link" value={formData.bookshop_link} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text" placeholder="Bookshop.org URL" />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-maroon-text">Barnes & Noble Link</label>
            <input name="barnes_noble_link" value={formData.barnes_noble_link} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text" placeholder="Barnes & Noble URL" />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700 dark:text-maroon-text">Read Alikes Image URL</label>
            <input name="read_alikes_image" value={formData.read_alikes_image} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-base text-gray-700 dark:text-maroon-text" placeholder="URL to read-alikes image" />
          </div>
        </div>
      </details>
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-maroon-text dark:hover:bg-maroon-card font-semibold text-sm"
          disabled={isSubmitting || uploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-3 rounded bg-rose-600 text-white hover:bg-rose-700 font-semibold text-sm dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent"
          disabled={isSubmitting || uploading}
        >
          {uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Save Review'}
        </button>
      </div>
    </form>
  );
}; 