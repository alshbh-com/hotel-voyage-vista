
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Heart, Home, Calendar, User, LogOut } from 'lucide-react';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

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
    </div>
  );
};

export default MainLayout;
