
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, CreditCard, Edit, X } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface GuestInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialRequests?: string;
}

const BookingsPage = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      console.log('Fetching bookings for user:', currentUser.id);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels!inner(name, city, images)
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      console.log('Fetched bookings:', data);
      return data;
    },
    enabled: !!currentUser
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .eq('user_id', currentUser?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'تم إلغاء الحجز',
        description: 'تم إلغاء حجزك بنجاح'
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إلغاء الحجز',
        variant: 'destructive'
      });
    }
  });

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-20">
          <p className="text-gray-500">يرجى تسجيل الدخول لعرض حجوزاتك</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'مؤكد';
      case 'pending': return 'في الانتظار';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">حجوزاتي</h1>
        <p className="text-gray-600">إدارة ومتابعة جميع حجوزاتك</p>
      </div>

      {bookings?.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد حجوزات</h3>
          <p className="text-gray-500">ابدأ بحجز إقامتك الأولى</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings?.map((booking: any) => {
            // Safely parse guest_info
            let guestInfo: GuestInfo = {};
            try {
              if (typeof booking.guest_info === 'string') {
                guestInfo = JSON.parse(booking.guest_info);
              } else if (booking.guest_info && typeof booking.guest_info === 'object') {
                guestInfo = booking.guest_info as GuestInfo;
              }
            } catch (error) {
              console.error('Error parsing guest_info:', error);
              guestInfo = {};
            }

            return (
              <Card key={booking.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-right">{booking.hotels?.name}</CardTitle>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 ml-1" />
                        <span className="text-sm">{booking.hotels?.city}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 ml-2" />
                        <span className="font-medium">تاريخ الوصول</span>
                      </div>
                      <p className="text-sm">
                        {format(new Date(booking.check_in), 'dd MMMM yyyy', { locale: ar })}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 ml-2" />
                        <span className="font-medium">تاريخ المغادرة</span>
                      </div>
                      <p className="text-sm">
                        {format(new Date(booking.check_out), 'dd MMMM yyyy', { locale: ar })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Users className="h-4 w-4 ml-2" />
                        <span className="font-medium">عدد النزلاء</span>
                      </div>
                      <p className="text-sm">{booking.guests} نزيل</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <CreditCard className="h-4 w-4 ml-2" />
                        <span className="font-medium">إجمالي المبلغ</span>
                      </div>
                      <p className="text-sm font-semibold">{booking.total_price} {booking.currency}</p>
                    </div>
                  </div>

                  {guestInfo && Object.keys(guestInfo).length > 0 && (
                    <div className="border-t pt-4">
                      {guestInfo.firstName && guestInfo.lastName && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">اسم النزيل:</span> {guestInfo.firstName} {guestInfo.lastName}
                        </p>
                      )}
                      {guestInfo.email && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">البريد الإلكتروني:</span> {guestInfo.email}
                        </p>
                      )}
                      {guestInfo.phone && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">رقم الهاتف:</span> {guestInfo.phone}
                        </p>
                      )}
                      {guestInfo.specialRequests && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">طلبات خاصة:</span> {guestInfo.specialRequests}
                        </p>
                      )}
                    </div>
                  )}

                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelBookingMutation.isPending}
                      >
                        <X className="h-4 w-4 ml-1" />
                        إلغاء الحجز
                      </Button>
                      {booking.status === 'pending' && (
                        <Button size="sm" className="flex-1" disabled>
                          <Edit className="h-4 w-4 ml-1" />
                          في انتظار التأكيد
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
