import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';

export const useBookings = () => {
  //As is a hook we can do it, in regular functions no
  const [searchParams] = useSearchParams();

  //FILTER
  const filterValue = searchParams.get('status');
  const filter =
    !filterValue || filterValue === 'all'
      ? null
      : {
          field: 'status',
          value: filterValue,
          method: 'eq',
        };

  //SORT
  const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';
  const [field, direction] = sortByRaw.split('-');
  const sortBy = { field, direction };

  const {
    isLoading,
    error,
    data: bookings,
  } = useQuery({
    queryKey: ['bookings', filter, sortBy], //After the key, every value works like the array of dependencies, so react query will refetch if any of the values change
    queryFn: () => getBookings({ filter, sortBy }),
  });

  return { isLoading, error, bookings };
};
