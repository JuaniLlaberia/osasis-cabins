import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '../../services/apiAuth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries(); //Removing all queries for safety reasons
      toast.success('Successfully logged out');
      navigate('/login', { replace: true });
    },
    onError: () => {
      toast.error('Failed to log out');
    },
  });

  return { logout, isLoading };
};
