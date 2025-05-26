
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loginAsGuest, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      toast({ title: 'تم تسجيل الدخول بنجاح!' });
    } catch (error) {
      toast({ 
        title: 'خطأ في تسجيل الدخول', 
        description: 'يرجى التحقق من البيانات والمحاولة مرة أخرى',
        variant: 'destructive' 
      });
    }
  };

  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
      toast({ title: 'تم الدخول كزائر بنجاح!' });
    } catch (error) {
      toast({ 
        title: 'خطأ في الدخول كزائر',
        variant: 'destructive' 
      });
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({ 
      title: `تسجيل الدخول عبر ${provider}`, 
      description: 'هذه الميزة ستتوفر قريباً' 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/30 rounded-full blur-lg"></div>
      
      <Card className="w-full max-w-md mx-4 backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            محجوز
          </CardTitle>
          <p className="text-gray-600 mt-2">منصة حجز الفنادق الرائدة</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-right"
            />
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-right"
            />
            
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </Button>
          </form>
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600"
            >
              {isLogin ? 'إنشاء حساب جديد' : 'لديك حساب بالفعل؟'}
            </Button>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialLogin('فيسبوك')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              تسجيل الدخول عبر فيسبوك
            </Button>
            
            <Button
              onClick={() => handleSocialLogin('جوجل')}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              تسجيل الدخول عبر جوجل
            </Button>
            
            <Button
              onClick={handleGuestLogin}
              variant="outline"
              className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              الدخول كزائر
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
