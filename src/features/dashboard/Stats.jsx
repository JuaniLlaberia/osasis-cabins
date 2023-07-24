import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';

export const Stats = ({ bookings, confirmedStays, numDays, cabinsCount }) => {
  //1.
  const numBookings = bookings.length;

  //2.
  const sales = bookings.reduce((acc, crr) => acc + crr.totalPrice, 0);

  //3.
  const checkins = confirmedStays.length;

  //4.
  //num checked in nights / all available nights (num of days * num of cabins)
  const occupation =
    confirmedStays.reduce((acc, crr) => acc + crr.numNights, 0) /
    (numDays * cabinsCount);

  return (
    <>
      <Stat
        title='Bookings'
        color='blue'
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title='Sales'
        color='green'
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title='Check ins'
        color='indigo'
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title='Occupancy rate'
        color='yellow'
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + '%'}
      />
    </>
  );
};
