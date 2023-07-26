import supabase, { supabaseUrl } from './supabase';

export const getCabins = async () => {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.log(error);
    throw new Error('Cabins could not be loaded');
  }
  return data;
};

export const deleteCabin = async (id, imgToRemove) => {
  //Deleting the row that matches the ID
  console.log(id, imgToRemove);
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.log(error);
    throw new Error('Cabins could not be deleted');
  }

  // Delete Image when we delete cabin
  const { error: errorRemoveImg } = await supabase.storage
    .from('cabin-images')
    .remove([imgToRemove]);

  if (errorRemoveImg) {
    console.log(errorRemoveImg);
  }

  return data;
};

export async function createEditCabin(newCabin, id, oldImage) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create/edit cabin
  let query = supabase.from('cabins');

  // A) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) EDIT
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id);

  const { data, error } = await query.select().single();

  // console.log(data);

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created');
  }

  // 2. Upload image
  if (hasImagePath) return data;

  //Should we remove the old image and then upload the new one (in case is an update)?
  if (oldImage) {
    const { error: errorRemoveImg } = await supabase.storage
      .from('cabin-images')
      .remove([oldImage]);

    console.log(errorRemoveImg ? errorRemoveImg : 'Image removed successfully');
  }

  //Upload new image
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin IF there was an error uplaoding image
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    console.error(storageError);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created'
    );
  }

  return data;
}

export const getAvailableCabinsBetweenDates = async (from, to, guests) => {
  if (!from || !to) return [];
  //1. We need to retrieve all cabins
  const { data: cabins, error: cabinsError } = await supabase
    .from('cabins')
    .select('*');

  if (cabinsError) throw new Error(cabinsError);

  //2. We nned to retrieve all bookings
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .gte('startDate', from)
    .lte('endDate', to);

  if (bookingsError) throw new Error(bookingsError);

  //3. Filter and get available cabins between those two dates
  const bookedCabinsIds = new Set(bookings.map(booking => booking.cabinId));

  const availableCabins = cabins.filter(
    cabin =>
      !bookedCabinsIds.has(cabin.id) &&
      cabin.maxCapacity >= guests &&
      cabin.maxCapacity <= guests + 2
  );

  //4. return data
  return availableCabins;
};
