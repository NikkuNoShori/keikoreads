import { useState, useEffect } from 'react';
import { Book, BookFormData, NewBook } from '../types/BookTypes';
import { supabase } from '../utils/supabaseClient';

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

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files && e.target.files[0];
    if (selected && (selected.type === 'image/png' || selected.type === 'image/jpeg')) {
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
    let coverImageUrl = formData.cover_image;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error } = await supabase.storage.from('book-covers').upload(fileName, file);
      if (error) {
        alert('Image upload failed: ' + error.message);
        setUploading(false);
        return;
      }
      const { publicUrl } = supabase.storage.from('book-covers').getPublicUrl(fileName).data;
      coverImageUrl = publicUrl;
    }
    await onSubmit({ ...formData, cover_image: coverImageUrl });
    setUploading(false);
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-2 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">
            Book Title <span className="text-maroon-card">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
            placeholder="Enter book title"
          />
        </div>
        {/* Author */}
        <div>
          <label htmlFor="author" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">
            Author <span className="text-maroon-card">*</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
            placeholder="Enter author name"
          />
        </div>
        {/* Series */}
        <div>
          <label htmlFor="series" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Series</label>
          <input
            type="text"
            id="series"
            name="series"
            value={formData.series || ''}
            onChange={handleChange}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
            placeholder="Book series (if applicable)"
          />
        </div>
        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre || ''}
            onChange={handleChange}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
            placeholder="Book genre"
          />
        </div>
        {/* Publish Date */}
        <div>
          <label htmlFor="publish_date" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Publish Date</label>
          <input
            type="date"
            id="publish_date"
            name="publish_date"
            value={formData.publish_date || ''}
            onChange={handleChange}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
          />
        </div>
        {/* Pages */}
        <div>
          <label htmlFor="pages" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Pages</label>
          <input
            type="number"
            id="pages"
            name="pages"
            value={formData.pages || ''}
            onChange={handleChange}
            min="1"
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
            placeholder="Number of pages"
          />
        </div>
        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Rating <span className="text-maroon-card">*</span></label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
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
          <label htmlFor="review_date" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Review Date</label>
          <input
            type="date"
            id="review_date"
            name="review_date"
            value={formData.review_date || ''}
            onChange={handleChange}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
          />
        </div>
        {/* Cover Image */}
        <div>
          <label htmlFor="cover_image" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Cover Image</label>
          <input
            type="file"
            id="cover_image_file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="w-full text-xs mb-1"
          />
          <input
            type="url"
            id="cover_image"
            name="cover_image"
            value={formData.cover_image || ''}
            onChange={handleChange}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
            placeholder="URL to book cover image (optional if uploading)"
            disabled={!!file}
          />
        </div>
      </div>
      {/* Description and Review */}
      <div className="mt-2 space-y-2">
        <div>
          <label htmlFor="description" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={2}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
            placeholder="Brief description or synopsis of the book"
          ></textarea>
        </div>
        <div>
          <label htmlFor="review" className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Review</label>
          <textarea
            id="review"
            name="review"
            value={formData.review || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text"
            placeholder="Your thoughts on the book"
          ></textarea>
        </div>
      </div>
      {/* More Options */}
      <details className="mt-2">
        <summary className="cursor-pointer text-maroon-card text-xs font-semibold mb-1">More Options</summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Goodreads Link</label>
            <input name="goodreads_link" value={formData.goodreads_link} onChange={handleChange} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text" placeholder="Goodreads URL" />
          </div>
          <div>
            <label className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Storygraph Link</label>
            <input name="storygraph_link" value={formData.storygraph_link} onChange={handleChange} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text" placeholder="StoryGraph URL" />
          </div>
          <div>
            <label className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Bookshop Link</label>
            <input name="bookshop_link" value={formData.bookshop_link} onChange={handleChange} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text" placeholder="Bookshop.org URL" />
          </div>
          <div>
            <label className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Barnes & Noble Link</label>
            <input name="barnes_noble_link" value={formData.barnes_noble_link} onChange={handleChange} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text" placeholder="Barnes & Noble URL" />
          </div>
          <div>
            <label className="block font-medium mb-0.5 text-xs text-gray-700 dark:text-maroon-text">Read Alikes Image URL</label>
            <input name="read_alikes_image" value={formData.read_alikes_image} onChange={handleChange} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-maroon-secondary text-xs text-gray-700 dark:text-maroon-text" placeholder="URL to read-alikes image" />
          </div>
        </div>
      </details>
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-maroon-text dark:hover:bg-maroon-card font-semibold text-xs"
          disabled={isSubmitting || uploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 font-semibold text-xs dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent"
          disabled={isSubmitting || uploading}
        >
          {uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Save Review'}
        </button>
      </div>
    </form>
  );
}; 