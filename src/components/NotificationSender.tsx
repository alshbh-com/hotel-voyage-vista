
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Send, Users, User } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const NotificationSender = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [recipient, setRecipient] = useState('all');
  const [specificUserId, setSpecificUserId] = useState('');
  const queryClient = useQueryClient();

  // Fetch all users for specific user selection
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .order('first_name');
      
      if (error) throw error;
      return data;
    }
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      if (recipient === 'all') {
        // Send to all users
        const { data: allUsers } = await supabase
          .from('profiles')
          .select('id');
        
        if (allUsers) {
          const notifications = allUsers.map(user => ({
            user_id: user.id,
            title,
            message,
            type
          }));
          
          const { error } = await supabase
            .from('notifications')
            .insert(notifications);
          
          if (error) throw error;
        }
      } else {
        // Send to specific user
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: specificUserId,
            title,
            message,
            type
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setTitle('');
      setMessage('');
      setType('info');
      setRecipient('all');
      setSpecificUserId('');
      toast({
        title: 'تم إرسال الإشعار بنجاح',
        description: `تم إرسال الإشعار ${recipient === 'all' ? 'لجميع المستخدمين' : 'للمستخدم المحدد'}`,
        duration: 500
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في الإرسال',
        description: error.message || 'حدث خطأ أثناء إرسال الإشعار',
        variant: 'destructive',
        duration: 500
      });
    }
  });

  const handleSend = () => {
    if (!title || !message) {
      toast({
        title: 'يرجى ملء جميع الحقول',
        variant: 'destructive',
        duration: 500
      });
      return;
    }

    if (recipient === 'specific' && !specificUserId) {
      toast({
        title: 'يرجى اختيار المستخدم',
        variant: 'destructive',
        duration: 500
      });
      return;
    }

    sendNotificationMutation.mutate({});
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="h-5 w-5 ml-2" />
          إرسال إشعارات للمستخدمين
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recipient">المستلم</Label>
          <Select value={recipient} onValueChange={setRecipient}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center">
                  <Users className="h-4 w-4 ml-2" />
                  جميع المستخدمين
                </div>
              </SelectItem>
              <SelectItem value="specific">
                <div className="flex items-center">
                  <User className="h-4 w-4 ml-2" />
                  مستخدم محدد
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {recipient === 'specific' && (
          <div>
            <Label htmlFor="user">اختيار المستخدم</Label>
            <Select value={specificUserId} onValueChange={setSpecificUserId}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المستخدم" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="type">نوع الإشعار</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">معلومات</SelectItem>
              <SelectItem value="success">نجاح</SelectItem>
              <SelectItem value="warning">تحذير</SelectItem>
              <SelectItem value="error">خطأ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="title">عنوان الإشعار</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="أدخل عنوان الإشعار"
            className="text-right"
          />
        </div>

        <div>
          <Label htmlFor="message">نص الإشعار</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="أدخل نص الإشعار"
            className="text-right min-h-24"
          />
        </div>

        <Button 
          onClick={handleSend}
          disabled={sendNotificationMutation.isPending}
          className="w-full"
        >
          <Send className="h-4 w-4 ml-2" />
          {sendNotificationMutation.isPending ? 'جاري الإرسال...' : 'إرسال الإشعار'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSender;
