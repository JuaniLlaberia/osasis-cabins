import { useMutation } from '@tanstack/react-query';
import { deleteBooking as deleteBookingApi } from '../../services/apiBookings';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useDeleteBooking = () => {
  const navigate = useNavigate();

  const { mutate: deleteBooking, isLoading: isDeleting } = useMutation({
    mutationFn: id => deleteBookingApi(id),
    onSuccess: () => {
      toast.success('Booking removed successfully');
      navigate('/bookings');
    },
    onError: () => {
      toast.error('Failed to remove booking');
    },
  });

  return { deleteBooking, isDeleting };
};
