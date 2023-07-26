import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import { FormRow } from '../../ui/FormRow';
import Input from '../../ui/Input';
import Checkbox from '../../ui/Checkbox';
import SpinnerMini from '../../ui/SpinnerMini';
import Heading from '../../ui/Heading';
import { styled } from 'styled-components';
import { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import { useSearchParams } from 'react-router-dom';
import { useSettings } from '../settings/useSettings';
import Spinner from '../../ui/Spinner';
import { useCreateBooking } from '../bookings/useCreateBooking';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
  margin-top: 1.5rem;
`;

function NewGuestBooking({ onCloseModal, numNights, nightPrice, cabinId }) {
  const { createBooking, isCreating } = useCreateBooking();
  const [addBreakfast, setAddBreakfast] = useState(false);
  //Creating reack hook form
  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;

  const { isLoading, settings } = useSettings();

  ///// CALCULATING ALL DATA FOR NEW BOOKING //////

  //Getting data from the URL
  const [searchParams] = useSearchParams();
  const numGuests = Number(searchParams.get('guestsNum'));
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (isLoading) return <Spinner />;

  //Prices
  const breakfastPrice = numNights * numGuests * settings.breakfastPrice;
  const cabinPrice = nightPrice * numNights;
  const totalPrice = addBreakfast ? cabinPrice + breakfastPrice : cabinPrice;

  const onSubmit = ({ fullName, email, nationality, nationalId }) => {
    createBooking({
      newGuest: { fullName, email, nationalID: nationalId, nationality },
      newBooking: {
        startDate: from.replace('T', ' ').replace('Z', ''),
        endDate: to.replace('T', ' ').replace('Z', ''),
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice: breakfastPrice,
        totalPrice,
        hasBreakfast: addBreakfast,
        isPaid: false,
        cabinId,
        guestId: '',
        status: 'unconfirmed',
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type='modal'>
      <Heading as='h4'>New Booking</Heading>
      <Heading as='h2'>Guest information</Heading>
      <FormRow label='Full name' error={errors?.fullName?.message}>
        <Input
          disabled={isCreating}
          type='text'
          id='fullName'
          {...register('fullName', {
            required: 'This field is requiered',
          })}
        />
      </FormRow>

      <FormRow label='Email address' error={errors?.email?.message}>
        <Input
          disabled={isCreating}
          type='email'
          id='email'
          {...register('email', {
            required: 'This field is requiered',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Provide a valid email address',
            },
          })}
        />
      </FormRow>

      <FormRow label='Your country' error={errors?.nationality?.message}>
        <Input
          disabled={isCreating}
          type='nationality'
          id='nationality'
          {...register('nationality', {
            required: 'This field is requiered',
          })}
        />
      </FormRow>

      <FormRow label='National ID' error={errors?.nationalId?.message}>
        <Input
          disabled={isCreating}
          type='nationalId'
          id='nationalId'
          {...register('nationalId', {
            required: 'This field is requiered',
          })}
        />
      </FormRow>
      <br />
      <Heading as='h2'>Extra booking information</Heading>
      <Box>
        <Checkbox
          checked={addBreakfast}
          onChange={() => {
            setAddBreakfast(add => !add);
          }}
          id='breakfast'
        >
          Add breakfast for {formatCurrency(breakfastPrice)}.
        </Checkbox>
      </Box>
      <FormRow>
        <p as='h2'>Total Price: {formatCurrency(totalPrice)}</p>
        <Button
          variation='secondary'
          type='reset'
          onClick={onCloseModal}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button>{isCreating ? <SpinnerMini /> : 'Add booking'}</Button>
      </FormRow>
    </Form>
  );
}

export default NewGuestBooking;
