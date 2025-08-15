'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, Settings, Home, Bell } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-lg font-bold text-gray-900">
              Saka-Kazi
            </Link>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="bg-white shadow-sm border-b hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                Saka-Kazi Dashboard
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/dashboard/profile" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </Link>
              <Link href="/dashboard/settings" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Settings
              </Link>
              <Link href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <nav className="px-4 py-3 space-y-2">
            <Link 
              href="/dashboard/profile"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link 
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Link 
              href="/"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
