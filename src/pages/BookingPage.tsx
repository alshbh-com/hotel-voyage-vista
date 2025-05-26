
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const BookingPage = () => {
  const { hotelId, suiteId, roomId } = useParams();
  const navigate = useNavigate();
  
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const mockRoomData = {
    hotelName: 'فندق الأزهر الراقي',
    suiteName: 'جناح الملكي',
    roomName: 'غرفة النوم الرئيسية',
    pricePerNight: 450,
    currency: 'EGP'
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * mockRoomData.pricePerNight;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut) {
      toast({
        title: 'تواريخ غير مكتملة',
        description: 'يرجى اختيار تاريخ الوصول والمغادرة',
        variant: 'destructive'
      });
      return;
    }

    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      toast({
        title: 'بيانات غير مكتملة',
        description: 'يرجى ملء جميع البيانات المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    // Navigate to payment page
    navigate('/payment', {
      state: {
        booking: {
          hotelId,
          suiteId,
          roomId,
          checkIn,
          checkOut,
          guests,
          guestInfo,
          total: calculateTotal(),
          ...mockRoomData
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowRight className="h-4 w-4 ml-2" />
        العودة
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-right">إكمال الحجز</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dates Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="text-right block">تاريخ الوصول</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP", { locale: ar }) : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkout" className="text-right block">تاريخ المغادرة</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP", { locale: ar }) : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-right block">عدد الضيوف</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="4"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="text-right"
                />
              </div>

              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-right">بيانات النزيل الرئيسي</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-right block">الاسم الأول *</Label>
                    <Input
                      id="firstName"
                      value={guestInfo.firstName}
                      onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                      className="text-right"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-right block">اسم العائلة *</Label>
                    <Input
                      id="lastName"
                      value={guestInfo.lastName}
                      onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                      className="text-right"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                    className="text-right"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right block">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                    className="text-right"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests" className="text-right block">طلبات خاصة</Label>
                  <textarea
                    id="requests"
                    value={guestInfo.specialRequests}
                    onChange={(e) => setGuestInfo({...guestInfo, specialRequests: e.target.value})}
                    className="w-full p-2 border rounded-md text-right"
                    rows={3}
                    placeholder="أي طلبات خاصة للإقامة..."
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                متابعة للدفع
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-fit">
          <CardHeader>
            <CardTitle className="text-xl text-right">ملخص الحجز</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-right">
              <h3 className="font-semibold">{mockRoomData.hotelName}</h3>
              <p className="text-gray-600">{mockRoomData.suiteName}</p>
              <p className="text-gray-600">{mockRoomData.roomName}</p>
            </div>

            {checkIn && checkOut && (
              <div className="space-y-2 py-4 border-t border-b">
                <div className="flex justify-between">
                  <span>تاريخ الوصول:</span>
                  <span>{format(checkIn, "PPP", { locale: ar })}</span>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ المغادرة:</span>
                  <span>{format(checkOut, "PPP", { locale: ar })}</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الليالي:</span>
                  <span>{Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الضيوف:</span>
                  <span>{guests}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>سعر الليلة:</span>
                <span>{mockRoomData.currency} {mockRoomData.pricePerNight}</span>
              </div>
              
              {checkIn && checkOut && (
                <>
                  <div className="flex justify-between">
                    <span>الضرائب والرسوم:</span>
                    <span>{mockRoomData.currency} {(calculateTotal() * 0.14).toFixed(0)}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>المجموع:</span>
                    <span className="text-purple-600">
                      {mockRoomData.currency} {(calculateTotal() * 1.14).toFixed(0)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
