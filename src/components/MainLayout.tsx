
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Heart, Home, Calendar, User, LogOut, Settings } from 'lucide-react';

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
    } else {
      alert('كلمة مرور خاطئة');
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
              
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-green-600">
                    <Settings className="h-5 w-5" />
                    الإدارة
                  </Button>
                </Link>
              )}
              
              {!isAdmin && (
                <Button 
                  onClick={() => setShowAdminLogin(true)}
                  variant="ghost" 
                  size="sm"
                  className="text-xs text-gray-400"
                >
                  •
                </Button>
              )}
              
              <Button onClick={logout} variant="ghost" size="sm" className="text-red-500">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
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
            <h3 className="text-lg font-semibold mb-4">دخول الإدارة</h3>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex space-x-2 space-x-reverse">
              <Button onClick={handleAdminLogin} className="flex-1">دخول</Button>
              <Button 
                onClick={() => setShowAdminLogin(false)} 
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

export default MainLayout;
