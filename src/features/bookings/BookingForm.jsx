import { useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { addDays } from 'date-fns';
import Form from '../../ui/Form';
import FormRowVertical from '../../ui/FormRowVertical';
import Heading from '../../ui/Heading';
import SpinnerMini from '../../ui/SpinnerMini';

export const BookingForm = ({ isLoading }) => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  //We update the search params in order to update the available cabins
  const handleSearch = e => {
    e.preventDefault();
    if (!from || !to) return;

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
    <Form>
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
      <FormRowVertical>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <SpinnerMini /> : 'Search availability'}
        </Button>
      </FormRowVertical>
    </Form>
  );
};
