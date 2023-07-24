import { BookingForm } from '../features/bookings/BookingForm';
import { useAvailableCabinsToBook } from '../features/bookings/useAvailableCabinsToBook';
import { CabinList } from '../features/cabins/CabinList';

export const NewBooking = () => {
  //Fetching available cabins to book (between days passed in the URL)
  const { availableCabins, isLoading } = useAvailableCabinsToBook();

  return (
    <>
      <BookingForm isLoading={isLoading} />
      <CabinList isLoading={isLoading} availableCabins={availableCabins} />
    </>
  );
};
