'use client';

import { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  Smartphone, 
  Mail, 
  Save,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotionalEmails: boolean;
  securityAlerts: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showLocation: boolean;
  showPhone: boolean;
  allowMessages: boolean;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    securityAlerts: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showLocation: true,
    showPhone: false,
    allowMessages: true
  });

  const [saving, setSaving] = useState(false);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement API call to save settings
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    label 
  }: { 
    enabled: boolean; 
    onChange: () => void; 
    label: string; 
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and privacy</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Notification Channels */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Channels</h4>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={notifications.emailNotifications}
                  onChange={() => handleNotificationChange('emailNotifications')}
                  label="Email Notifications"
                />
                <ToggleSwitch
                  enabled={notifications.pushNotifications}
                  onChange={() => handleNotificationChange('pushNotifications')}
                  label="Push Notifications"
                />
                <ToggleSwitch
                  enabled={notifications.smsNotifications}
                  onChange={() => handleNotificationChange('smsNotifications')}
                  label="SMS Notifications"
                />
              </div>
            </div>

            {/* Notification Types */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Types</h4>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={notifications.orderUpdates}
                  onChange={() => handleNotificationChange('orderUpdates')}
                  label="Order Updates"
                />
                <ToggleSwitch
                  enabled={notifications.promotionalEmails}
                  onChange={() => handleNotificationChange('promotionalEmails')}
                  label="Promotional Emails"
                />
                <ToggleSwitch
                  enabled={notifications.securityAlerts}
                  onChange={() => handleNotificationChange('securityAlerts')}
                  label="Security Alerts"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Privacy & Security</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Profile Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Public - Anyone can see my profile</option>
                <option value="friends">Friends Only - Only connected users</option>
                <option value="private">Private - Hidden from search</option>
              </select>
            </div>

            {/* Information Sharing */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Information Sharing</h4>
              <div className="space-y-4">
                <ToggleSwitch
                  enabled={privacy.showLocation}
                  onChange={() => handlePrivacyChange('showLocation', !privacy.showLocation)}
                  label="Show Location"
                />
                <ToggleSwitch
                  enabled={privacy.showPhone}
                  onChange={() => handlePrivacyChange('showPhone', !privacy.showPhone)}
                  label="Show Phone Number"
                />
                <ToggleSwitch
                  enabled={privacy.allowMessages}
                  onChange={() => handlePrivacyChange('allowMessages', !privacy.allowMessages)}
                  label="Allow Direct Messages"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Mail className="h-4 w-4 mr-2" />
              Change Email
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Smartphone className="h-4 w-4 mr-2" />
              Two-Factor Auth
            </button>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Language & Region</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="UTC+1">UTC+1 (West Africa Time)</option>
                <option value="UTC+0">UTC+0 (GMT)</option>
                <option value="UTC-5">UTC-5 (Eastern Time)</option>
                <option value="UTC+8">UTC+8 (China Standard Time)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
