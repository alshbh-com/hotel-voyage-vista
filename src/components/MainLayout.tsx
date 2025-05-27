
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Heart, Home, Calendar, User, LogOut, Lock } from 'lucide-react';
import OverviewTab from '@/components/dashboard/OverviewTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import HotelsTab from '@/components/dashboard/HotelsTab';
import BookingsTab from '@/components/dashboard/BookingsTab';
import UsersTab from '@/components/dashboard/UsersTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = () => {
    if (adminPassword === '01278006248') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('كلمة مرور خاطئة');
      setAdminPassword('');
    }
  };

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'الحجوزات', href: '/bookings', icon: Calendar },
    { name: 'الملف الشخصي', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10"></div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                محجوز
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button 
                onClick={() => setShowAdminLogin(true)}
                variant="ghost" 
                size="sm" 
                className="text-purple-600"
              >
                <Lock className="h-5 w-5" />
              </Button>

              <Link to="/notifications" className="relative">
                <Button variant="ghost" size="sm" className="text-purple-600">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/favorites">
                <Button variant="ghost" size="sm" className="text-purple-600">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Button onClick={logout} variant="ghost" size="sm" className="text-red-500">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {isAdmin ? (
          <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
            <AdminDashboard onClose={() => setIsAdmin(false)} />
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-200 px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-purple-600 bg-purple-100' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">دخول لوحة التحكم</h3>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4 text-right"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="flex space-x-2 space-x-reverse">
              <Button onClick={handleAdminLogin} className="flex-1">دخول</Button>
              <Button 
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPassword('');
                }} 
                variant="outline" 
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم الشاملة</h1>
        <Button onClick={onClose} variant="outline">
          إغلاق لوحة التحكم
        </Button>
      </div>
      <DashboardContent />
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [appSettings, setAppSettings] = useState({
    app_name: 'محجوز',
    app_description: 'منصة حجز الفنادق الرائدة في المنطقة',
    support_phone: '201204486263',
    support_email: 'support@mahjoz.com',
    default_currency: 'EGP',
    maintenance_mode: false,
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6',
    logo_url: '',
    terms_url: '',
    privacy_url: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: ''
  });

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: 'نظرة عامة' },
          { id: 'settings', label: 'إعدادات التطبيق' },
          { id: 'hotels', label: 'إدارة الفنادق' },
          { id: 'bookings', label: 'إدارة الحجوزات' },
          { id: 'users', label: 'إدارة المستخدمين' },
          { id: 'notifications', label: 'الإشعارات' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'settings' && <SettingsTab appSettings={appSettings} setAppSettings={setAppSettings} />}
      {activeTab === 'hotels' && <HotelsTab />}
      {activeTab === 'bookings' && <BookingsTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
    </div>
  );
};

export default MainLayout;
