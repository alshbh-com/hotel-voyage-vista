
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

const UsersTab = () => {
  const { data: users } = useQuery({
    queryKey: ['dashboardUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إدارة المستخدمين الشاملة</h2>
      
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="text-right">
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                  <p className="text-sm text-gray-500">
                    انضم في: {new Date(user.created_at).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <div className="text-left">
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    مستخدم نشط
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
