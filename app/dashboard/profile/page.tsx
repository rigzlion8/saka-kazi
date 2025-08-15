'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Edit } from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar_url?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  };
  gold_member?: boolean;
  is_verified?: boolean;
  status: string;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: {
      address: ''
    }
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      const mockProfile: UserProfile = {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+234 801 234 5678',
        role: 'provider',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        location: {
          type: 'Point',
          coordinates: [3.3792, 6.5244],
          address: 'Lagos, Nigeria'
        },
        gold_member: true,
        is_verified: true,
        status: 'active',
        created_at: '2024-01-15T00:00:00.000Z'
      };
      
      setProfile(mockProfile);
      setFormData({
        name: mockProfile.name,
        phone: mockProfile.phone,
        location: {
          address: mockProfile.location?.address || ''
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement API call to update profile
    setTimeout(() => {
      setIsEditing(false);
      setSaving(false);
    }, 1000);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone,
        location: {
          address: profile.location?.address || ''
        }
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile not found</h2>
        <p className="text-gray-600">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={profile.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{profile.role}</p>
              
              {/* Status Badges */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {profile.is_verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                )}
                {profile.gold_member && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Gold Member
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {profile.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{profile.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{profile.phone}</span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      location: { ...formData.location, address: e.target.value }
                    })}
                    placeholder="Enter your address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{profile.location?.address || 'No location set'}</span>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
