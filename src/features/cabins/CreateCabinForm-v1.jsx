import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCabin } from '../../services/apiCabins';
import { toast } from 'react-hot-toast';
import { FormRow } from '../../ui/FormRow';
import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';

function CreateCabinForm({ cabin }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  const clientQuery = useQueryClient();

  const { mutate, isLoading: isCreating } = useMutation({
    //Mutation function
    mutationFn: newCabin => createCabin(newCabin),
    //Only if its successful this will be trigger
    onSuccess: () => {
      toast.success('New Cabin successfully created');
      clientQuery.invalidateQueries({
        queryKey: ['cabins'],
      });
      //reset form fields
      reset();
    },
    onError: err => {
      toast.error(err.message);
    },
  });

  const onSubmit = data => {
    mutate({ ...data, image: data.image[0] });
  };

  const onError = errors => {
    // console.log(errors);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label='Cabin Name' error={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isCreating}
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>
      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        <Input
          type='number'
          id='maxCapacity'
          disabled={isCreating}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>
      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        <Input
          type='number'
          id='regularPrice'
          disabled={isCreating}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>
      <FormRow label='Discount' error={errors?.discount?.message}>
        <Input
          type='number'
          id='discount'
          defaultValue={0}
          disabled={isCreating}
          {...register('discount', {
            required: 'This field is required',
            validate: value =>
              value < getValues().regularPrice ||
              'Discount should be less than regular price',
          })}
        />
      </FormRow>
      <FormRow
        label='Description for website'
        error={errors?.description?.message}
      >
        <Textarea
          type='number'
          id='description'
          disabled={isCreating}
          defaultValue=''
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Cabin Photo'>
        <FileInput
          id='image'
          accept='image/*'
          disabled={isCreating}
          {...register('image', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation='secondary' type='reset'>
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {!isCreating ? 'Add cabin' : 'Creating...'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
