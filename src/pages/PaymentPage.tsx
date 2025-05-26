
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  if (!booking) {
    navigate('/');
    return null;
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    toast({
      title: 'تم الدفع بنجاح!',
      description: 'سيتم إرسال تأكيد الحجز على بريدك الإلكتروني',
    });
    
    setTimeout(() => {
      navigate('/bookings');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowRight className="h-4 w-4 ml-2" />
        العودة
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-right">إكمال الدفع</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-right block">طريقة الدفع</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="ml-2 h-5 w-5" />
                      بطاقة ائتمان / خصم
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="flex items-center cursor-pointer">
                      <Smartphone className="ml-2 h-5 w-5" />
                      محفظة إلكترونية
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center cursor-pointer">
                      <Banknote className="ml-2 h-5 w-5" />
                      الدفع عند الوصول
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-right block">اسم حامل البطاقة</Label>
                    <Input
                      id="cardName"
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                      className="text-right"
                      placeholder="الاسم كما هو مكتوب على البطاقة"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-right block">رقم البطاقة</Label>
                    <Input
                      id="cardNumber"
                      value={cardInfo.number}
                      onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
                      className="text-left"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-right block">تاريخ الانتهاء</Label>
                      <Input
                        id="expiry"
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                        className="text-left"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-right block">CVV</Label>
                      <Input
                        id="cvv"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                        className="text-left"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Payment */}
              {paymentMethod === 'mobile' && (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Smartphone className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">سيتم توجيهك لتطبيق المحفظة الإلكترونية</p>
                </div>
              )}

              {/* Cash Payment */}
              {paymentMethod === 'cash' && (
                <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Banknote className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
                  <p className="text-yellow-800 font-medium mb-2">الدفع عند الوصول</p>
                  <p className="text-yellow-700 text-sm">
                    يمكنك دفع المبلغ نقداً أو بالبطاقة عند وصولك للفندق
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {paymentMethod === 'cash' ? 'تأكيد الحجز' : 'إتمام الدفع'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-fit">
          <CardHeader>
            <CardTitle className="text-xl text-right">ملخص الدفع</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-right">
              <h3 className="font-semibold">{booking.hotelName}</h3>
              <p className="text-gray-600">{booking.suiteName}</p>
              <p className="text-gray-600">{booking.roomName}</p>
            </div>

            <div className="space-y-2 py-4 border-t border-b">
              <div className="flex justify-between">
                <span>المبلغ الأساسي:</span>
                <span>{booking.currency} {booking.total}</span>
              </div>
              <div className="flex justify-between">
                <span>الضرائب والرسوم:</span>
                <span>{booking.currency} {(booking.total * 0.14).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>خصم الحجز المبكر:</span>
                <span className="text-green-600">-{booking.currency} {(booking.total * 0.05).toFixed(0)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>المبلغ الإجمالي:</span>
              <span className="text-purple-600">
                {booking.currency} {(booking.total * 1.09).toFixed(0)}
              </span>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              <p>جميع الأسعار شاملة الضرائب والرسوم</p>
              <p>يمكن إلغاء الحجز مجاناً حتى 24 ساعة قبل الوصول</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
