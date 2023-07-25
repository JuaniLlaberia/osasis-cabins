import { PAGE_SIZE } from '../utils/constants';
import { getToday } from '../utils/helpers';
import supabase from './supabase';

export const getBookings = async ({ filter, sortBy, page }) => {
  let query = supabase
    .from('bookings')
    //We can specify which columns we want to get
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)',
      { count: 'exact' } //This object with the count: 'exact' will return the count (length) of data
    );

  //Filter
  if (filter) query[filter.method || 'eq'](filter.field, filter.value);

  //Sort by
  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === 'asc',
    });
  }

  //Pagination
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.log(error);
    throw new Error('Bookings could not be loaded');
  }

  return { data, count };
};

export async function getBooking(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking not found');
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, totalPrice, extrasPrice')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from('bookings')
    // .select('*')
    .select('*, guests(fullName)')
    .gte('startDate', date)
    .lte('startDate', getToday());

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(fullName, nationality, countryFlag)')
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order('created_at');

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}

//With this function we create a new guest and a new booking
export const createBooking = async ({ newGuest, newBooking }) => {
  //Guest Flag
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${newGuest.nationality}`
    );
    const flag = await res.json();

    newGuest.countryFlag = `https://flagcdn.com/${flag[0].cca2.toLowerCase()}.svg`;
  } catch (err) {
    console.log(err);
  }

  //Creating New Guest
  const { data, error } = await supabase
    .from('guests')
    .insert([newGuest])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Guest could not be created');
  }

  //Adding guest ID to booking object
  newBooking.guestId = data?.id;

  //Creating new booking
  console.log(newBooking);
  const { data: bookingData, error: bookingError } = await supabase
    .from('bookings')
    .insert([newBooking])
    .select()
    .single();

  if (bookingError) {
    console.error(bookingError);
    throw new Error('booking could not be created');
  }

  return bookingData;
};
