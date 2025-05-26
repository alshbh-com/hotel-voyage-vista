
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Phone, Calendar, Mail, Edit, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: ''
  });
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!currentUser
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!currentUser) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          ...data,
          date_of_birth: data.date_of_birth || null,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast({ title: 'تم تحديث الملف الشخصي بنجاح' });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الملف الشخصي',
        variant: 'destructive'
      });
    }
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || ''
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || ''
      });
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-20">
          <p className="text-gray-500">يرجى تسجيل الدخول لعرض الملف الشخصي</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">الملف الشخصي</h1>
        <p className="text-gray-600">إدارة معلوماتك الشخصية</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {(formData.first_name?.[0] || currentUser.email?.[0] || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl">
            {formData.first_name && formData.last_name 
              ? `${formData.first_name} ${formData.last_name}`
              : currentUser.email
            }
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">المعلومات الشخصية</h3>
            {!isEditing ? (
              <Button onClick={handleEdit} size="sm" variant="outline">
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" disabled={updateProfileMutation.isPending}>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline">
                  <X className="h-4 w-4 ml-2" />
                  إلغاء
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="flex items-center mb-2">
                <User className="h-4 w-4 ml-2" />
                الاسم الأول
              </Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="text-right"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded text-right">{formData.first_name || 'غير محدد'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name" className="flex items-center mb-2">
                <User className="h-4 w-4 ml-2" />
                الاسم الأخير
              </Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="text-right"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded text-right">{formData.last_name || 'غير محدد'}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center mb-2">
              <Mail className="h-4 w-4 ml-2" />
              البريد الإلكتروني
            </Label>
            <p className="p-2 bg-gray-50 rounded text-right text-gray-600">{currentUser.email}</p>
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center mb-2">
              <Phone className="h-4 w-4 ml-2" />
              رقم الهاتف
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="text-right"
                placeholder="01xxxxxxxxx"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded text-right">{formData.phone || 'غير محدد'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date_of_birth" className="flex items-center mb-2">
              <Calendar className="h-4 w-4 ml-2" />
              تاريخ الميلاد
            </Label>
            {isEditing ? (
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className="text-right"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded text-right">
                {formData.date_of_birth 
                  ? new Date(formData.date_of_birth).toLocaleDateString('ar-EG')
                  : 'غير محدد'
                }
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
