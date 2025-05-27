
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BookingsTab = () => {
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ['dashboardBookings'],
    queryFn: async () => {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels!inner(name, city)
        `)
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;
      return bookingsData || [];
    }
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', bookingId);
      
      if (error) throw error;

      if (status === 'confirmed') {
        console.log('Payment confirmed - Money transferred to hotel account');
      } else if (status === 'cancelled') {
        console.log('Booking cancelled - Refund initiated to customer');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dashboardBookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      if (variables.status === 'confirmed') {
        toast({ 
          title: 'تم تأكيد الحجز',
          description: 'تم تحويل المبلغ لحساب الفندق',
          duration: 1000
        });
      } else if (variables.status === 'cancelled') {
        toast({ 
          title: 'تم إلغاء الحجز',
          description: 'تم بدء إجراءات استرداد المبلغ للعميل',
          duration: 1000
        });
      }
    }
  });

  const handleUpdateBookingStatus = (bookingId: string, status: string) => {
    if (confirm(`هل أنت متأكد من ${status === 'confirmed' ? 'تأكيد' : 'إلغاء'} هذا الحجز؟`)) {
      updateBookingMutation.mutate({ bookingId, status });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إدارة الحجوزات الشاملة</h2>
      
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {bookings?.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="text-right">
                  <p className="font-medium">{booking.hotels?.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.check_in).toLocaleDateString('ar-EG')} - 
                    {new Date(booking.check_out).toLocaleDateString('ar-EG')}
                  </p>
                  <p className="text-sm text-gray-500">عدد النزلاء: {booking.guests}</p>
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
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.total_price} {booking.currency}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                          disabled={updateBookingMutation.isPending}
                        >
                          <CheckCircle className="h-3 w-3 ml-1" />
                          قبول
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                          disabled={updateBookingMutation.isPending}
                        >
                          <XCircle className="h-3 w-3 ml-1" />
                          رفض
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                        disabled={updateBookingMutation.isPending}
                      >
                        <XCircle className="h-3 w-3 ml-1" />
                        إلغاء الحجز
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsTab;
