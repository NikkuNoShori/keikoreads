import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { supabase } from '../utils/supabaseClient';
import { DatePicker } from '../components/DatePicker';
import { getBooks, updateBook } from '../utils/bookService';
import { Book } from '../types/BookTypes';
import { FiRefreshCw } from 'react-icons/fi';

interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  email?: string;
}

export const Settings = () => {
  const { profile, profileLoading, refreshProfile, user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [localProfile, setLocalProfile] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [recyclingBooks, setRecyclingBooks] = useState<Book[]>([]);
  const [recyclingLoading, setRecyclingLoading] = useState(false);
  const [recyclingError, setRecyclingError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.date_of_birth) {
      setDateOfBirth(new Date(profile.date_of_birth));
    }
    setLocalProfile(profile);
  }, [profile]);

  // Clear the update success message after 3 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  // Fetch deleted books for Recycling Bin
  const fetchRecyclingBooks = () => {
    setRecyclingLoading(true);
    getBooks('review_date', 'desc', { deleted: true }, 1, 50)
      .then(({ data, error }) => {
        if (error) setRecyclingError(error.message);
        else setRecyclingBooks(data || []);
      })
      .finally(() => setRecyclingLoading(false));
  };

  useEffect(() => {
    if (activeTab === 'recycling') {
      fetchRecyclingBooks();
    }
  }, [activeTab]);

  // Listen for refreshRecyclingBin event
  useEffect(() => {
    const handler = () => {
      if (activeTab === 'recycling') fetchRecyclingBooks();
    };
    window.addEventListener('refreshRecyclingBin', handler);
    return () => window.removeEventListener('refreshRecyclingBin', handler);
  }, [activeTab]);

  // Restore book handler
  const handleRestore = async (bookId: string) => {
    setRecyclingLoading(true);
    setRecyclingError(null);
    const { error } = await updateBook(bookId, { deleted: false } as any);
    if (error) {
      setRecyclingError(error.message);
    } else {
      setRecyclingBooks(prev => prev.filter(b => b.id !== bookId));
    }
    setRecyclingLoading(false);
  };

  // Input validation
  const validateInput = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'first_name':
      case 'last_name':
        if (!value.trim()) return 'This field is required';
        if (value.length > 50) return 'Maximum 50 characters allowed';
        if (!/^[a-zA-Z\s-']+$/.test(value)) return 'Only letters, spaces, hyphens and apostrophes allowed';
        return undefined;
      case 'date_of_birth':
        if (value) {
          const dob = new Date(value);
          const today = new Date();
          if (dob > today) return 'Date of birth cannot be in the future';
          const minDate = new Date();
          minDate.setFullYear(today.getFullYear() - 120);
          if (dob < minDate) return 'Invalid date of birth';
        }
        return undefined;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update the local profile
    setLocalProfile((prev) => prev ? { ...prev, [name]: value } : prev);
    
    // Validate and update errors
    const error = validateInput(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Reset success message when editing
    if (updateSuccess) setUpdateSuccess(false);
  };

  const handleDateOfBirthChange = (date: Date | null) => {
    if (localProfile) {
      const dateStr = date ? date.toISOString().split('T')[0] : null;
      setDateOfBirth(date);
      setLocalProfile({ ...localProfile, date_of_birth: dateStr });
      
      // Validate and update errors
      const error = dateStr ? validateInput('date_of_birth', dateStr) : undefined;
      setErrors(prev => ({
        ...prev,
        date_of_birth: error
      }));

      // Reset success message when editing
      if (updateSuccess) setUpdateSuccess(false);
    }
  };

  const isFormValid = (): boolean => {
    // Validate all fields before submission
    const newErrors: ValidationErrors = {};
    if (localProfile) {
      Object.entries(localProfile).forEach(([key, value]) => {
        if (['first_name', 'last_name', 'date_of_birth', 'email'].includes(key)) {
          const error = validateInput(key, value as string);
          if (error) newErrors[key as keyof ValidationErrors] = error;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!localProfile) return;
    if (!isFormValid()) return;

    setLoading(true);
    try {
      // Prepare data for update - all editable fields
      const { id, first_name, last_name, date_of_birth, email, avatar_url } = localProfile;
      const updateData = {
        first_name,
        last_name,
        date_of_birth,
        email,
        avatar_url
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Fetch the latest profile from Supabase
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (!fetchError && updatedProfile) {
        setLocalProfile(updatedProfile);
        await refreshProfile();
        // Broadcast profile update to other tabs
        localStorage.setItem('profileUpdated', Date.now().toString());
      }

      setUpdateSuccess(true);
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get the avatar from OAuth or profile
  const getAvatar = () => {
    // First try profile avatar
    if (localProfile?.avatar_url) {
      return localProfile.avatar_url;
    }
    
    // Then try user metadata from OAuth
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    
    return null;
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="w-full">
        <h1 className="text-5xl text-center mb-8" style={{ fontFamily: "'Allura', cursive", fontWeight: 'normal' }}>Account Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="shadow rounded-lg p-4">
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-rose-100 text-rose-700 dark:bg-gray-700 dark:text-rose-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === 'account'
                      ? 'bg-rose-100 text-rose-700 dark:bg-gray-700 dark:text-rose-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('recycling')}
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === 'recycling'
                      ? 'bg-rose-100 text-rose-700 dark:bg-gray-700 dark:text-rose-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Recycling Bin
                </button>
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1">
            <div className="shadow rounded-lg p-6">
              {updateSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 rounded-md">
                  Profile updated successfully!
                </div>
              )}
              
              {activeTab === 'profile' && localProfile && (
                <form onSubmit={e => { e.preventDefault(); saveProfile(); }}>
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      {getAvatar() ? (
                        <img
                          src={getAvatar()!}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-gray-700 flex items-center justify-center text-2xl font-medium text-rose-600 dark:text-gray-200">
                          {localProfile.first_name ? localProfile.first_name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getAvatar() ? 'Photo from your account' : 'No profile photo set'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={localProfile.first_name || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      />
                      {errors.first_name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={localProfile.last_name || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                      />
                      {errors.last_name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <DatePicker
                      selected={dateOfBirth}
                      onChange={handleDateOfBirthChange}
                      name="date_of_birth"
                      placeholder="Select your date of birth"
                      hasError={!!errors.date_of_birth}
                      maxDate={new Date()}
                      minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 120))}
                    />
                    {errors.date_of_birth && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date_of_birth}</p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={localProfile.email || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${!!(user?.app_metadata?.provider && user.app_metadata.provider !== 'email') ? 'bg-gray-100 dark:bg-gray-800 opacity-60 cursor-not-allowed' : ''}`}
                      disabled={!!(user?.app_metadata?.provider && user.app_metadata.provider !== 'email')}
                    />
                    {user?.app_metadata?.provider && user.app_metadata.provider !== 'email' && (
                      <p className="mt-1 text-xs text-blue-600 dark:text-blue-300">
                        Email address is managed by your OAuth provider (e.g., Google). To change your email, update it in your provider account. It will sync here next time you log in with that provider.
                      </p>
                    )}
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || profileLoading}
                  >
                    {loading || profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}
              {activeTab === 'account' && localProfile && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {user?.app_metadata?.provider 
                        ? `Your account is connected with ${user.app_metadata.provider}` 
                        : 'Your account uses email for login'}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-8 pt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h3>
                    <button className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'recycling' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recycling Bin</h2>
                    <button
                      onClick={fetchRecyclingBooks}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Refresh"
                      title="Refresh"
                      disabled={recyclingLoading}
                    >
                      <FiRefreshCw className={`w-5 h-5 ${recyclingLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  {recyclingLoading ? (
                    <div className="text-gray-500 dark:text-gray-400">Loading deleted books...</div>
                  ) : recyclingError ? (
                    <div className="text-red-500 dark:text-red-400">{recyclingError}</div>
                  ) : recyclingBooks.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400">No deleted books found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deleted At</th>
                            <th className="px-4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {recyclingBooks.map(book => (
                            <tr key={book.id}>
                              <td className="px-4 py-2 whitespace-nowrap">{book.title}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{book.author}</td>
                              <td className="px-4 py-2 whitespace-nowrap">{book.deleted_at ? new Date(book.deleted_at).toLocaleString() : ''}</td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <button
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  onClick={() => handleRestore(book.id)}
                                  disabled={recyclingLoading}
                                >
                                  Restore
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}; 