
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NotificationsTab = () => {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          user_id: null // إرسال لجميع المستخدمين
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'تم إرسال الإشعار بنجاح',
        description: 'تم إرسال الإشعار لجميع المستخدمين',
        duration: 1000
      });
      setNotification({
        title: '',
        message: '',
        type: 'info'
      });
    }
  });

  const handleSendNotification = () => {
    if (!notification.title || !notification.message) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
        duration: 1000
      });
      return;
    }
    sendNotificationMutation.mutate(notification);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إدارة الإشعارات والرسائل</h2>
      
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 ml-2" />
            إرسال إشعار لجميع المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notificationTitle">عنوان الإشعار</Label>
            <Input
              id="notificationTitle"
              value={notification.title}
              onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
              placeholder="عنوان الإشعار"
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="notificationMessage">رسالة الإشعار</Label>
            <Textarea
              id="notificationMessage"
              value={notification.message}
              onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
              placeholder="اكتب رسالة الإشعار هنا..."
              className="text-right min-h-24"
            />
          </div>

          <div>
            <Label htmlFor="notificationType">نوع الإشعار</Label>
            <select
              id="notificationType"
              value={notification.type}
              onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            >
              <option value="info">معلومات</option>
              <option value="warning">تحذير</option>
              <option value="success">نجاح</option>
              <option value="error">خطأ</option>
            </select>
          </div>

          <Button 
            onClick={handleSendNotification}
            disabled={sendNotificationMutation.isPending}
            className="w-full"
          >
            <Send className="h-4 w-4 ml-2" />
            {sendNotificationMutation.isPending ? 'جاري الإرسال...' : 'إرسال الإشعار'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
