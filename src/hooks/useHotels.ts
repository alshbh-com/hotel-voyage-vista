
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Hotel } from '@/types';

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: async (): Promise<Hotel[]> => {
      const { data, error } = await supabase
        .from('hotels')
        .select(`
          *,
          suites:suites(
            *,
            rooms:rooms(*)
          )
        `);
      
      if (error) throw error;
      
      return data.map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        description: hotel.description || '',
        address: hotel.address,
        city: hotel.city,
        rating: Number(hotel.rating) || 0,
        images: hotel.images || [],
        amenities: hotel.amenities || [],
        pricePerNight: hotel.price_per_night,
        currency: hotel.currency || 'EGP',
        suites: hotel.suites?.map(suite => ({
          id: suite.id,
          name: suite.name,
          description: suite.description || '',
          images: suite.images || [],
          amenities: suite.amenities || [],
          rooms: suite.rooms?.map(room => ({
            id: room.id,
            name: room.name,
            type: room.type,
            pricePerNight: room.price_per_night,
            maxGuests: room.max_guests || 2,
            images: room.images || [],
            amenities: room.amenities || [],
            available: room.available
          })) || []
        })) || []
      }));
    }
  });
};
