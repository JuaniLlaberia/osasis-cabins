import { useQuery } from '@tanstack/react-query';
import { getAvailableCabinsBetweenDates } from '../../services/apiCabins';
import { useSearchParams } from 'react-router-dom';

export const useAvailableCabinsToBook = () => {
  const [searchParams] = useSearchParams();

  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const {
    data: availableCabins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['availableCabins', from, to],
    queryFn: () => getAvailableCabinsBetweenDates(from, to),
    retry: false,
  });

  return { availableCabins, isLoading, error };
};
