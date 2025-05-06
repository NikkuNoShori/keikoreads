import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

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

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

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
        id,
        first_name,
        last_name,
        date_of_birth,
        email,
        avatar_url
      };

      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await refreshProfile();
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
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
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
                <div>
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
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={localProfile.date_of_birth || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
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
                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                  <button
                    className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={saveProfile}
                    disabled={loading || profileLoading}
                  >
                    {loading || profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
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
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}; 