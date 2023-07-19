import { useSearchParams } from 'react-router-dom';
import { Select } from './Select';

export const SortBy = ({ options }) => {
  const [searchParams, setSeachParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || '';

  const handleChange = e => {
    searchParams.set('sortBy', e.target.value);
    setSeachParams(searchParams);
  };

  return (
    <Select
      options={options}
      type='white'
      value={sortBy}
      onChange={handleChange}
    />
  );
};
