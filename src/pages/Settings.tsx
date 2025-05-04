import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const Settings = () => {
  const { profile, profileLoading, refreshProfile } = useAuthContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [localProfile, setLocalProfile] = useState(profile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const saveProfile = async () => {
    if (!localProfile) return;
    setLoading(true);
    // Only update changed fields
    const { id, first_name, last_name, date_of_birth, avatar_url } = localProfile;
    await fetch('/api/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, first_name, last_name, date_of_birth, avatar_url }),
    });
    await refreshProfile();
    setLoading(false);
    alert('Profile updated successfully!');
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
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
                  onClick={() => setActiveTab('preferences')}
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === 'preferences'
                      ? 'bg-rose-100 text-rose-700 dark:bg-gray-700 dark:text-rose-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Preferences
                </button>
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              {activeTab === 'profile' && localProfile && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      {localProfile.avatar_url ? (
                        <img
                          src={localProfile.avatar_url}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-gray-700 flex items-center justify-center text-2xl font-medium text-rose-600 dark:text-gray-200">
                          {localProfile.first_name ? localProfile.first_name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {localProfile.avatar_url ? 'Photo from OAuth provider' : 'No profile photo set'}
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
                        value={localProfile.first_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={localProfile.last_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={localProfile.email}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email can't be changed when authenticated with Google
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
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about new reviews</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading List Updates</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when books on your reading list are updated</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors dark:bg-maroon-card dark:text-maroon-text dark:hover:bg-maroon-accent">
                      Save Preferences
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