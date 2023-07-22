import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';

export const useBookings = () => {
  const queryClient = useQueryClient();
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

  // //PAGINATION
  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

  const {
    isLoading,
    error,
    data: { data: bookings, count } = {},
  } = useQuery({
    queryKey: ['bookings', filter, sortBy, page], //After the key, every value works like the array of dependencies, so react query will refetch if any of the values change
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  //PRE FETCHING REACT QUERY
  //We want to fetch the next page so when we go it doesntt have to load. Example: If we are in page 1 we want to also fetch page 2 (but nothing else). THen if we go to page 2
  //that data will have already been fetched and its render automatically without loading, and at that momment we fetch the next page, etc etc
  const pageCount = Math.ceil(count / PAGE_SIZE);

  //With this we avoid fetching an extra time when we dont have any more pages and we are already in the last one
  if (page < pageCount) {
    queryClient.prefetchQuery({
      //It accepts a queryKey and a queryFn
      queryKey: ['bookings', filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
    //We are gettubg the same data but +1 page.
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      //Here we fetch the prev page, so we also already have the previous page and it doesnt have to load
      queryKey: ['bookings', filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });
  }

  //So basically with this implementation, we fetch the current page, the prev and the next. So we dont have to be waiting for that data when we change page.
  //And when its the first page we only fetch the next. And when its the last page we only fetch the prev.

  return { isLoading, error, bookings, count };
};
