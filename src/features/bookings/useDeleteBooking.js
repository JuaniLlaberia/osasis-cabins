import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooking as deleteBookingApi } from '../../services/apiBookings';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useDeleteBooking = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteBooking, isLoading: isDeleting } = useMutation({
    mutationFn: id => deleteBookingApi(id),
    onSuccess: () => {
      toast.success('Booking removed successfully');
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
      navigate('/bookings');
    },
    onError: () => {
      toast.error('Failed to remove booking');
    },
  });

  return { deleteBooking, isDeleting };
};
