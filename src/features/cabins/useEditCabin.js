import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEditCabin } from '../../services/apiCabins';
import { toast } from 'react-hot-toast';

export const useEditCabin = () => {
  const clientQuery = useQueryClient();

  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id, oldImage }) =>
      createEditCabin(newCabinData, id, oldImage),
    onSuccess: () => {
      toast.success('Cabin successfully edited');
      clientQuery.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: err => toast.error(err.message),
  });

  return { isEditing, editCabin };
};
