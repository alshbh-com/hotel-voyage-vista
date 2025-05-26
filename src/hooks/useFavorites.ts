
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ['favorites', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select('hotel_id')
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      return data.map(item => item.hotel_id);
    },
    enabled: !!currentUser
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('hotel_id', hotelId)
        .single();
      
      if (existing) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('hotel_id', hotelId);
        if (error) throw error;
        return 'removed';
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: currentUser.id, hotel_id: hotelId });
        if (error) throw error;
        return 'added';
      }
    },
    onSuccess: (action) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: action === 'added' ? 'تم إضافة الفندق للمفضلة' : 'تم إزالة الفندق من المفضلة'
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث المفضلة',
        variant: 'destructive'
      });
    }
  });

  return {
    favorites: favoritesQuery.data || [],
    isLoading: favoritesQuery.isLoading,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isToggling: toggleFavoriteMutation.isPending
  };
};
