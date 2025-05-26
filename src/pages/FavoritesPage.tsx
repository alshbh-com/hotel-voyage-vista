
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { currentUser } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  const { data: favoriteHotels, isLoading } = useQuery({
    queryKey: ['favoriteHotels', currentUser?.id],
    queryFn: async () => {
      if (!currentUser || favorites.length === 0) return [];
      
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .in('id', favorites);
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentUser && favorites.length > 0
  });

  if (!currentUser) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-20">
          <p className="text-gray-500">يرجى تسجيل الدخول لعرض المفضلة</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">الفنادق المفضلة</h1>
        <p className="text-gray-600">
          {favoriteHotels?.length || 0} فندق في قائمة المفضلة
        </p>
      </div>

      {!favoriteHotels || favoriteHotels.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد فنادق مفضلة</h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة فنادق لقائمة المفضلة</p>
          <Link to="/">
            <Button>تصفح الفنادق</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={hotel.images?.[0] || '/placeholder.svg'}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  onClick={() => toggleFavorite(hotel.id)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 left-2 rounded-full text-red-500 bg-white/80 hover:bg-white/90"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
                <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-sm">
                  {hotel.currency} {hotel.price_per_night}/ليلة
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-right">{hotel.name}</CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 ml-1" />
                    <span className="text-sm">{hotel.city}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-3 text-right line-clamp-2">
                  {hotel.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {hotel.amenities && hotel.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{hotel.amenities.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Link to={`/hotel/${hotel.id}`}>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    عرض التفاصيل
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
