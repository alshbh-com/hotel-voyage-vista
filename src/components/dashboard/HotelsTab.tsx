
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HotelData {
  name: string;
  description: string;
  address: string;
  city: string;
  price_per_night: string;
  rating: string;
  amenities: string;
  images: string;
}

const HotelsTab = () => {
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [newHotel, setNewHotel] = useState<HotelData>({
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

  const { data: hotels } = useQuery({
    queryKey: ['dashboardHotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const addHotelMutation = useMutation({
    mutationFn: async (hotelData: HotelData) => {
      const amenitiesArray = hotelData.amenities.split(',').map(a => a.trim()).filter(a => a);
      const imagesArray = hotelData.images ? 
        hotelData.images.split(',').map(i => i.trim()).filter(i => i) : 
        ['/lovable-uploads/cc6d0fe2-5f1d-4f23-831f-230b4c18a2f2.png'];
      
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
          images: imagesArray
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardHotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
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
      toast({ 
        title: 'تم إضافة الفندق بنجاح',
        duration: 1000
      });
    }
  });

  const deleteHotelMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', hotelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardHotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast({ 
        title: 'تم حذف الفندق بنجاح',
        duration: 1000
      });
    }
  });

  const handleAddHotel = () => {
    addHotelMutation.mutate(newHotel);
  };

  const handleDeleteHotel = (hotelId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفندق؟')) {
      deleteHotelMutation.mutate(hotelId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الفنادق الشاملة</h2>
        <Button onClick={() => setIsAddingHotel(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة فندق جديد
        </Button>
      </div>

      {isAddingHotel && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
                {addHotelMutation.isPending ? 'جاري الإضافة...' : 'إضافة الفندق'}
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
                src={hotel.images?.[0] || '/lovable-uploads/cc6d0fe2-5f1d-4f23-831f-230b4c18a2f2.png'}
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
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => handleDeleteHotel(hotel.id)}
                  disabled={deleteHotelMutation.isPending}
                >
                  <Trash2 className="h-3 w-3 ml-1" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HotelsTab;
