'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  Settings
} from 'lucide-react';
import { formatKESAmount } from '@/lib/currency';

interface DashboardStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalEarnings: number;
  rating: number;
  reviews: number;
}

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<'customer' | 'provider' | 'admin'>('customer');
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    rating: 0,
    reviews: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalOrders: 24,
        completedOrders: 18,
        pendingOrders: 6,
        totalEarnings: 125000,
        rating: 4.8,
        reviews: 12
      });
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, href, color = 'blue' }: {
    title: string;
    description: string;
    icon: any;
    href: string;
    color?: string;
  }) => (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
        <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600 inline-block mb-3`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back, User! 👋
        </h1>
        <p className="text-blue-100 text-sm sm:text-base">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completedOrders}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Pending"
          value={stats.pendingOrders}
          icon={AlertCircle}
          color="yellow"
        />
        <StatCard
          title="Total Earnings"
          value={formatKESAmount(stats.totalEarnings)}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Rating & Reviews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Rating</h3>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-900 mr-2">{stats.rating}</span>
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(stats.rating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{stats.reviews} reviews</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium text-gray-900">+12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Month</span>
              <span className="text-sm font-medium text-gray-900">+8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <QuickActionCard
            title="View Profile"
            description="Update your personal information and preferences"
            icon={User}
            href="/dashboard/profile"
            color="blue"
          />
          <QuickActionCard
            title="Manage Orders"
            description="Track and manage your current orders"
            icon={Briefcase}
            href="/dashboard/orders"
            color="green"
          />
          <QuickActionCard
            title="Earnings"
            description="View your earnings and payment history"
            icon={DollarSign}
            href="/dashboard/earnings"
            color="purple"
          />
          <QuickActionCard
            title="Schedule"
            description="Manage your availability and appointments"
            icon={Calendar}
            href="/dashboard/schedule"
            color="orange"
          />
          <QuickActionCard
            title="Settings"
            description="Configure your account and notification preferences"
            icon={Settings}
            href="/dashboard/settings"
            color="gray"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Order #{1000 + i} was completed successfully
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
