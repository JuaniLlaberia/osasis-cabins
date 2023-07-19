import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';

export const useSettings = () => {
  const {
    isLoading,
    error,
    data: settings,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings, //ASYNC FUNCTIOn
  });

  return { isLoading, error, settings };
};
