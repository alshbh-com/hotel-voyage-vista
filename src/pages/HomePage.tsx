
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHotels } from '@/hooks/useHotels';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: hotels, isLoading } = useHotels();
  const { favorites, toggleFavorite } = useFavorites();
  const { currentUser } = useAuth();

  const filteredHotels = hotels?.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          مرحباً بك في محجوز
        </h1>
        <p className="text-gray-600">اكتشف أفضل الفنادق واحجز إقامتك المثالية</p>
      </div>

      {/* Search Section */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="ابحث عن فندق أو مدينة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 text-right bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'فنادق متاحة', value: `${hotels?.length || 0}+`, color: 'bg-blue-500' },
          { label: 'مدن', value: `${new Set(hotels?.map(h => h.city)).size || 0}+`, color: 'bg-purple-500' },
          { label: 'عملاء راضون', value: '10K+', color: 'bg-pink-500' },
          { label: 'حجوزات ناجحة', value: '50K+', color: 'bg-green-500' }
        ].map((stat, index) => (
          <Card key={index} className="text-center bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className="text-white font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img
                src={hotel.images[0] || '/placeholder.svg'}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              {currentUser && (
                <Button
                  onClick={() => toggleFavorite(hotel.id)}
                  variant="ghost"
                  size="sm"
                  className={`absolute top-2 left-2 rounded-full ${
                    favorites.includes(hotel.id) 
                      ? 'text-red-500 bg-white/80' 
                      : 'text-gray-400 bg-white/60'
                  } hover:bg-white/90`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(hotel.id) ? 'fill-current' : ''}`} />
                </Button>
              )}
              <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-sm">
                {hotel.currency} {hotel.pricePerNight}/ليلة
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
              <p className="text-gray-600 text-sm mb-3 text-right">{hotel.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {hotel.amenities.length > 3 && (
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

      {filteredHotels.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد فنادق تطابق بحثك</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
