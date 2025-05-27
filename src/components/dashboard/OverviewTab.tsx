
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, Users, Calendar, BarChart3 } from 'lucide-react';

const OverviewTab = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const [hotelsRes, bookingsRes, usersRes] = await Promise.all([
        supabase.from('hotels').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' })
      ]);

      return {
        hotels: hotelsRes.count || 0,
        bookings: bookingsRes.count || 0,
        users: usersRes.count || 0
      };
    }
  });

  const { data: recentBookings } = useQuery({
    queryKey: ['recentBookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels!inner(name, city)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الفنادق</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.hotels || 0}</p>
              </div>
              <Hotel className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الحجوزات</p>
                <p className="text-3xl font-bold text-green-600">{stats?.bookings || 0}</p>
              </div>
              <Calendar className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.users || 0}</p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 ml-2" />
            آخر الأنشطة والحجوزات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings?.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="text-right">
                  <p className="font-medium">{booking.hotels?.name}</p>
                  <p className="text-sm text-gray-600">حجز جديد - {booking.total_price} {booking.currency}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(booking.created_at).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <div className="text-left">
                  <span className={`px-2 py-1 rounded text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'مؤكد' :
                     booking.status === 'pending' ? 'في الانتظار' : 'ملغي'}
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

export default OverviewTab;
