
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, MapPin, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import { Hotel, Suite, Room } from '@/types';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedSuite, setSelectedSuite] = useState<Suite | null>(null);

  useEffect(() => {
    // Mock data for hotel details
    const mockHotel: Hotel = {
      id: id || '1',
      name: 'فندق الأزهر الراقي',
      description: 'فندق فاخر في قلب المدينة مع خدمات 5 نجوم. يوفر الفندق تجربة إقامة لا تُنسى مع أحدث وسائل الراحة والخدمات المتميزة.',
      address: 'شارع التحرير، وسط البلد، القاهرة',
      city: 'القاهرة',
      rating: 4.8,
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      amenities: ['واي فاي مجاني', 'مسبح', 'صالة رياضة', 'مطعم', 'موقف سيارات', 'خدمة الغرف', 'مركز أعمال', 'سبا'],
      pricePerNight: 250,
      currency: 'EGP',
      suites: [
        {
          id: 'suite1',
          name: 'جناح الملكي',
          description: 'جناح فاخر مع إطلالة بانورامية على المدينة',
          images: ['/placeholder.svg'],
          amenities: ['شرفة خاصة', 'حمام جاكوزي', 'غرفة معيشة منفصلة'],
          rooms: [
            {
              id: 'room1',
              name: 'غرفة النوم الرئيسية',
              type: 'ملكية',
              pricePerNight: 450,
              maxGuests: 2,
              images: ['/placeholder.svg'],
              amenities: ['سرير كينغ ساイز', 'تلفزيون ذكي', 'مكيف هواء'],
              available: true
            },
            {
              id: 'room2',
              name: 'غرفة النوم الثانوية',
              type: 'مزدوجة',
              pricePerNight: 350,
              maxGuests: 2,
              images: ['/placeholder.svg'],
              amenities: ['سريرين مفردين', 'تلفزيون', 'مكيف هواء'],
              available: true
            }
          ]
        },
        {
          id: 'suite2',
          name: 'جناح العائلة',
          description: 'جناح مثالي للعائلات مع مساحات واسعة',
          images: ['/placeholder.svg'],
          amenities: ['مطبخ صغير', 'غرفة معيشة', 'شرفة'],
          rooms: [
            {
              id: 'room3',
              name: 'غرفة الوالدين',
              type: 'مزدوجة',
              pricePerNight: 300,
              maxGuests: 2,
              images: ['/placeholder.svg'],
              amenities: ['سرير كينغ ساイز', 'حمام خاص', 'تلفزيون'],
              available: true
            },
            {
              id: 'room4',
              name: 'غرفة الأطفال',
              type: 'مفردة',
              pricePerNight: 200,
              maxGuests: 2,
              images: ['/placeholder.svg'],
              amenities: ['سريرين طابقين', 'ألعاب', 'تلفزيون'],
              available: false
            }
          ]
        }
      ]
    };
    setHotel(mockHotel);
  }, [id]);

  if (!hotel) {
    return <div>جاري التحميل...</div>;
  }

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes('واي فاي')) return <Wifi className="h-4 w-4" />;
    if (amenity.includes('موقف')) return <Car className="h-4 w-4" />;
    if (amenity.includes('مطعم')) return <Coffee className="h-4 w-4" />;
    if (amenity.includes('رياضة')) return <Dumbbell className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/">
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للرئيسية
        </Link>
      </Button>

      {/* Hotel Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {hotel.images.slice(1, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${hotel.name} ${index + 2}`}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-right">{hotel.name}</h1>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="ml-2 font-medium">{hotel.rating}/5</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 ml-1" />
              <span>{hotel.address}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6 text-right leading-relaxed">{hotel.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {hotel.amenities.slice(0, 8).map((amenity, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                {getAmenityIcon(amenity)}
                <span className="text-sm mr-2">{amenity}</span>
              </div>
            ))}
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
            <span className="text-2xl font-bold">{hotel.currency} {hotel.pricePerNight}</span>
            <span className="block text-sm opacity-90">ابتداءً من / ليلة</span>
          </div>
        </div>
      </div>

      {/* Suites Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">الأجنحة المتاحة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotel.suites.map((suite) => (
            <Card key={suite.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-right">{suite.name}</CardTitle>
                  <Button
                    onClick={() => setSelectedSuite(selectedSuite?.id === suite.id ? null : suite)}
                    variant={selectedSuite?.id === suite.id ? "default" : "outline"}
                    size="sm"
                  >
                    {selectedSuite?.id === suite.id ? 'إخفاء الغرف' : 'عرض الغرف'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <img
                  src={suite.images[0]}
                  alt={suite.name}
                  className="w-full h-32 object-cover rounded mb-4"
                />
                
                <p className="text-gray-600 mb-4 text-right">{suite.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {suite.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                {selectedSuite?.id === suite.id && (
                  <div className="space-y-3 mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-right">الغرف المتاحة:</h4>
                    {suite.rooms.map((room) => (
                      <div key={room.id} className={`p-3 rounded-lg border ${room.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-right">{room.name}</span>
                          <Badge variant={room.available ? "default" : "destructive"}>
                            {room.available ? 'متاحة' : 'محجوزة'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span>النوع: {room.type}</span>
                          <span className="mx-2">•</span>
                          <span>الحد الأقصى: {room.maxGuests} ضيوف</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-purple-600">
                            {hotel.currency} {room.pricePerNight}/ليلة
                          </span>
                          
                          {room.available && (
                            <Link to={`/booking/${hotel.id}/${suite.id}/${room.id}`}>
                              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                                احجز الآن
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
