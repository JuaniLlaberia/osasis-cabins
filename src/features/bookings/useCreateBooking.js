import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking as createBookingApi } from '../../services/apiBookings';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createBooking, isLoading: isCreating } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: booking => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(`Booking #${booking.id} created successfully`);
      navigate(`/bookings/${booking.id}`);
    },
    onError: () => {
      toast.error('Failed to create new booking');
    },
  });

  return { createBooking, isCreating };
};
