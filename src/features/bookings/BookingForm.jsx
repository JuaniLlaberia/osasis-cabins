import { useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import ButtonIcon from '../../ui/ButtonIcon';
import { addDays } from 'date-fns';
import Form from '../../ui/Form';
import FormRowVertical from '../../ui/FormRowVertical';
import Heading from '../../ui/Heading';
import SpinnerMini from '../../ui/SpinnerMini';
import { HiOutlineUserMinus, HiOutlineUserPlus } from 'react-icons/hi2';
import { styled } from 'styled-components';

const GuestContainer = styled.div`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;

  & div {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  & span,
  label {
    font-weight: 500;
  }
`;

export const BookingForm = ({ isLoading }) => {
  const [guests, setGuests] = useState(2);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleGuests = (e, num) => {
    e.preventDefault();
    if (guests > 10 || guests < 1) return;

    setGuests(g => g + num);
  };

  //We update the search params in order to update the available cabins
  const handleSearch = e => {
    e.preventDefault();
    if (!from || !to) return;

    searchParams.set('guestsNum', guests);
    searchParams.set('from', new Date(from).toISOString());
    searchParams.set('to', new Date(to).toISOString());

    setSearchParams(searchParams);
  };

  //Get today and tomorrow as the minimum options
  const minFrom = new Date().toISOString().split('T')[0];

  //Always one day after the 'from date'
  const fromRef = useRef();
  const minTo = addDays(
    new Date(fromRef.current?.value ? fromRef.current.value : new Date()),
    1
  )
    ?.toISOString()
    .split('T')[0];

  return (
    <Form onSubmit={handleSearch}>
      <Heading as='h4'>Check availability</Heading>
      <FormRowVertical label='Starting date'>
        <Input
          ref={fromRef}
          id='from'
          type='date'
          value={from || ''}
          onChange={e => setFrom(e.target.value)}
          min={minFrom}
        />
      </FormRowVertical>
      <FormRowVertical label='Ending date'>
        <Input
          id='to'
          type='date'
          value={to || ''}
          onChange={e => setTo(e.target.value)}
          min={minTo}
        />
      </FormRowVertical>
      <GuestContainer>
        <label>Num. of guests</label>
        <div>
          <ButtonIcon
            onClick={e => handleGuests(e, -1)}
            disabled={guests === 1}
          >
            <HiOutlineUserMinus />
          </ButtonIcon>
          <span>{guests}</span>
          <ButtonIcon
            onClick={e => handleGuests(e, 1)}
            disabled={guests === 10}
          >
            <HiOutlineUserPlus />
          </ButtonIcon>
        </div>
      </GuestContainer>
      <FormRowVertical>
        <Button disabled={isLoading}>
          {isLoading ? <SpinnerMini /> : 'Search availability'}
        </Button>
      </FormRowVertical>
    </Form>
  );
};
