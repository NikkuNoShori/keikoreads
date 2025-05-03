import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ReviewFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const ReviewForm = ({ onSubmit, onCancel, initialData }: ReviewFormProps) => {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    author: initialData?.author || '',
    series: initialData?.series || '',
    genre: initialData?.genre || '',
    publish_date: initialData?.publish_date || '',
    pages: initialData?.pages || '',
    rating: initialData?.rating || 3,
    description: initialData?.description || '',
    review: initialData?.review || '',
    review_date: initialData?.review_date || '',
    cover_image: initialData?.cover_image || '',
    goodreads_link: initialData?.goodreads_link || '',
    storygraph_link: initialData?.storygraph_link || '',
    bookshop_link: initialData?.bookshop_link || '',
    barnes_noble_link: initialData?.barnes_noble_link || '',
    read_alikes_image: initialData?.read_alikes_image || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Insert into Supabase
    const { data, error } = await supabase.from('books').insert([form]).select().single();
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" placeholder="Enter book title" />
        </div>
        <div>
          <label className="block font-medium mb-1">Author *</label>
          <input name="author" value={form.author} onChange={handleChange} required className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" placeholder="Enter author name" />
        </div>
        <div>
          <label className="block font-medium mb-1">Series</label>
          <input name="series" value={form.series} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" placeholder="Book series (if applicable)" />
        </div>
        <div>
          <label className="block font-medium mb-1">Genre</label>
          <input name="genre" value={form.genre} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" placeholder="Book genre" />
        </div>
        <div>
          <label className="block font-medium mb-1">Publish Date</label>
          <input type="date" name="publish_date" value={form.publish_date} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" />
        </div>
        <div>
          <label className="block font-medium mb-1">Pages</label>
          <input type="number" name="pages" value={form.pages} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" placeholder="Number of pages" />
        </div>
        <div>
          <label className="block font-medium mb-1">Rating *</label>
          <select name="rating" value={form.rating} onChange={handleChange} required className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400">
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Review Date</label>
          <input type="date" name="review_date" value={form.review_date} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" />
        </div>
        <div>
          <label className="block font-medium mb-1">Cover Image URL</label>
          <input name="cover_image" value={form.cover_image} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" placeholder="URL to book cover image" />
        </div>
        <div>
          <label className="block font-medium mb-1">Goodreads Link</label>
          <input name="goodreads_link" value={form.goodreads_link} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" placeholder="Goodreads URL" />
        </div>
        <div>
          <label className="block font-medium mb-1">Storygraph Link</label>
          <input name="storygraph_link" value={form.storygraph_link} onChange={handleChange} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400" placeholder="StoryGraph URL" />
        </div>
        <div>
          <label className="block font-medium mb-1">Bookshop Link</label>
          <input name="bookshop_link" value={form.bookshop_link} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Barnes & Noble Link</label>
          <input name="barnes_noble_link" value={form.barnes_noble_link} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block font-medium mb-1">Read Alikes Image URL</label>
          <input name="read_alikes_image" value={form.read_alikes_image} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block font-medium mb-1">Review</label>
        <textarea name="review" value={form.review} onChange={handleChange} rows={5} className="w-full px-3 py-2 border rounded" />
      </div>
      <div className="flex justify-end gap-2 mt-4">
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
}; 