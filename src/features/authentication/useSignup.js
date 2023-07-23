import { useMutation } from '@tanstack/react-query';
import { signup as signupApi } from '../../services/apiAuth';
import { toast } from 'react-hot-toast';

export const useSignup = () => {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: data => {
      toast.success('New account successfully created! Verify the email.');
    },
  });

  return { signup, isLoading };
};
