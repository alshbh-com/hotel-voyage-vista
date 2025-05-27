
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, CheckCircle, Calendar, Users, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface PaymentData {
  hotelId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: string;
  guestInfo: any;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('PaymentPage mounted, location state:', location.state);
    
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
      console.log('Payment data set:', location.state.paymentData);
    } else {
      console.log('No payment data found, redirecting to home');
      toast({
        title: 'خطأ في بيانات الدفع',
        description: 'لم يتم العثور على بيانات الحجز، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
        duration: 500
      });
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  const simulatePayment = async () => {
    setIsProcessing(true);
    
    try {
      console.log('بدء محاكاة عملية الدفع...');
      
      // محاكاة تأخير معالجة الدفع
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // إنشاء الحجز في قاعدة البيانات
      const bookingData = {
        user_id: currentUser?.id,
        hotel_id: paymentData?.hotelId,
        suite_id: '00000000-0000-0000-0000-000000000000',
        room_id: '00000000-0000-0000-0000-000000000000',
        check_in: paymentData?.checkIn,
        check_out: paymentData?.checkOut,
        guests: paymentData?.guests,
        total_price: paymentData?.totalPrice,
        currency: paymentData?.currency || 'EGP',
        guest_info: paymentData?.guestInfo,
        status: 'pending'
      };

      console.log('إنشاء الحجز في قاعدة البيانات:', bookingData);

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error('خطأ في إنشاء الحجز:', error);
        throw error;
      }

      console.log('تم إنشاء الحجز بنجاح:', data);

      // محاكاة نجاح الدفع
      toast({
        title: 'تم الدفع بنجاح! 💳',
        description: 'تم إنشاء حجزك وسيتم مراجعته من قبل الإدارة',
        duration: 500
      });

      // التوجه إلى صفحة الحجوزات بعد نجاح الدفع
      setTimeout(() => {
        navigate('/bookings', { replace: true });
      }, 1000);
      
    } catch (error: any) {
      console.error('خطأ في إنشاء الحجز:', error);
      toast({
        title: 'خطأ في الدفع',
        description: 'حدث خطأ أثناء معالجة الدفع، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
        duration: 500
      });
    }
    
    setIsProcessing(false);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      toast({
        title: 'يرجى ملء جميع البيانات',
        variant: 'destructive',
        duration: 500
      });
      return;
    }

    console.log('بدء عملية الدفع الوهمي...');
    await simulatePayment();
  };

  if (!paymentData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">إتمام الدفع الوهمي</h1>
        <p className="text-gray-600">أدخل بيانات البطاقة الوهمية لإتمام الحجز</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ملخص الحجز */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 ml-2" />
              ملخص الحجز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">{paymentData.hotelName}</h3>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 ml-1" />
                <span className="text-sm">فندق محجوز</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ الوصول:</span>
                <span className="font-medium">
                  {format(new Date(paymentData.checkIn), 'dd MMMM yyyy', { locale: ar })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ المغادرة:</span>
                <span className="font-medium">
                  {format(new Date(paymentData.checkOut), 'dd MMMM yyyy', { locale: ar })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">عدد النزلاء:</span>
                <span className="font-medium flex items-center">
                  <Users className="h-4 w-4 ml-1" />
                  {paymentData.guests}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-green-600">
                  {paymentData.totalPrice} {paymentData.currency}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* نموذج الدفع الوهمي */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 ml-2" />
              بيانات الدفع الوهمي
            </CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <Lock className="h-4 w-4 ml-1" />
              <span>نظام دفع وهمي للتطوير والاختبار</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="cardHolder">اسم حامل البطاقة</Label>
                <Input
                  id="cardHolder"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="أدخل أي اسم للاختبار"
                  className="text-right"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">رقم البطاقة الوهمي</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                      }
                      setExpiryDate(value);
                    }}
                    placeholder="12/26"
                    maxLength={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 ml-2" />
                  <span className="text-blue-800 font-medium">نظام دفع وهمي للتطوير</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  يمكنك استخدام أي أرقام للاختبار. سيتم إنشاء الحجز ومحاكاة عملية الدفع بنجاح.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري معالجة الدفع الوهمي...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 ml-2" />
                    دفع {paymentData.totalPrice} {paymentData.currency} (وهمي)
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
