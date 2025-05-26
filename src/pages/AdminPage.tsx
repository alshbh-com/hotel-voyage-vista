
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hotel, Users, Calendar, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    price_per_night: '',
    rating: '',
    amenities: '',
    images: ''
  });
  const queryClient = useQueryClient();

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
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

  // Fetch all hotels
  const { data: hotels } = useQuery({
    queryKey: ['adminHotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch all bookings
  const { data: bookings } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels:hotel_id(name),
          profiles:user_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Add hotel mutation
  const addHotelMutation = useMutation({
    mutationFn: async (hotelData: typeof newHotel) => {
      const amenitiesArray = hotelData.amenities.split(',').map(a => a.trim()).filter(a => a);
      const imagesArray = hotelData.images.split(',').map(i => i.trim()).filter(i => i);
      
      const { error } = await supabase
        .from('hotels')
        .insert({
          name: hotelData.name,
          description: hotelData.description,
          address: hotelData.address,
          city: hotelData.city,
          price_per_night: parseInt(hotelData.price_per_night),
          rating: parseFloat(hotelData.rating),
          amenities: amenitiesArray,
          images: imagesArray.length > 0 ? imagesArray : ['/placeholder.svg']
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHotels'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setIsAddingHotel(false);
      setNewHotel({
        name: '',
        description: '',
        address: '',
        city: '',
        price_per_night: '',
        rating: '',
        amenities: '',
        images: ''
      });
      toast({ title: 'تم إضافة الفندق بنجاح' });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة الفندق',
        variant: 'destructive'
      });
    }
  });

  const handleAddHotel = () => {
    addHotelMutation.mutate(newHotel);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة الإدارة</h1>
        <p className="text-gray-600">إدارة ومراقبة جميع عمليات التطبيق</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="hotels">الفنادق</TabsTrigger>
          <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>آخر الحجوزات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings?.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="text-right">
                      <p className="font-medium">{booking.hotels?.name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.profiles?.first_name} {booking.profiles?.last_name}
                      </p>
                    </div>
                    <div className="text-left">
                      <Badge 
                        className={
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {booking.status === 'confirmed' ? 'مؤكد' :
                         booking.status === 'pending' ? 'في الانتظار' : 'ملغي'}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.total_price} {booking.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotels">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">إدارة الفنادق</h2>
            <Button onClick={() => setIsAddingHotel(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة فندق جديد
            </Button>
          </div>

          {isAddingHotel && (
            <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>إضافة فندق جديد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">اسم الفندق</Label>
                    <Input
                      id="name"
                      value={newHotel.name}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, name: e.target.value }))}
                      className="text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      value={newHotel.city}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, city: e.target.value }))}
                      className="text-right"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={newHotel.description}
                    onChange={(e) => setNewHotel(prev => ({ ...prev, description: e.target.value }))}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={newHotel.address}
                    onChange={(e) => setNewHotel(prev => ({ ...prev, address: e.target.value }))}
                    className="text-right"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">السعر لكل ليلة</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newHotel.price_per_night}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, price_per_night: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">التقييم</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      max="5"
                      value={newHotel.rating}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, rating: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="amenities">المرافق (مفصولة بفاصلة)</Label>
                  <Input
                    id="amenities"
                    value={newHotel.amenities}
                    onChange={(e) => setNewHotel(prev => ({ ...prev, amenities: e.target.value }))}
                    placeholder="واي فاي مجاني, مسبح, صالة رياضة"
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="images">روابط الصور (مفصولة بفاصلة)</Label>
                  <Input
                    id="images"
                    value={newHotel.images}
                    onChange={(e) => setNewHotel(prev => ({ ...prev, images: e.target.value }))}
                    placeholder="/placeholder.svg, /hotel1.jpg"
                    className="text-right"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddHotel}
                    disabled={addHotelMutation.isPending}
                  >
                    إضافة الفندق
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingHotel(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels?.map((hotel) => (
              <Card key={hotel.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <img
                    src={hotel.images?.[0] || '/placeholder.svg'}
                    alt={hotel.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h3 className="font-semibold text-right mb-2">{hotel.name}</h3>
                  <p className="text-sm text-gray-600 text-right mb-2">{hotel.city}</p>
                  <p className="text-sm font-medium">{hotel.price_per_night} EGP/ليلة</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3 ml-1" />
                      تعديل
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1">
                      <Trash2 className="h-3 w-3 ml-1" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <h2 className="text-2xl font-bold mb-6">إدارة الحجوزات</h2>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                {bookings?.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="text-right">
                      <p className="font-medium">{booking.hotels?.name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.profiles?.first_name} {booking.profiles?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.check_in).toLocaleDateString('ar-EG')} - 
                        {new Date(booking.check_out).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <div className="text-left">
                      <Badge 
                        className={
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {booking.status === 'confirmed' ? 'مؤكد' :
                         booking.status === 'pending' ? 'في الانتظار' : 'ملغي'}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.total_price} {booking.currency}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="xs" variant="outline">تعديل</Button>
                        <Button size="xs" variant="destructive">إلغاء</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <h2 className="text-2xl font-bold mb-6">إعدادات التطبيق</h2>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 ml-2" />
                الإعدادات العامة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">ستتوفر إعدادات إضافية قريباً...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
