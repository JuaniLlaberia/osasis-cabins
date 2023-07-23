import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/apiAuth';
import { toast } from 'react-hot-toast';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading: isLogging } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: user => {
      queryClient.setQueryData(['user'], user.user); //Settings data to the cache (manually)
      toast.success('User logged in correctly');
      navigate('/', { replace: true });
    },
    onError: error => {
      console.log('ERROR', error);
      toast.error('Provided email or password are incorrect');
    },
  });

  return { login, isLogging };
};
