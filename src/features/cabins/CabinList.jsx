import { styled } from 'styled-components';
import Heading from '../../ui/Heading';
import Spinner from '../../ui/Spinner';
import { CabinItem } from './CabinItem';

const StyledCabinList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const CabinList = ({ isLoading, availableCabins }) => {
  if (isLoading) return <Spinner />;

  return (
    <>
      {!availableCabins?.length ? null : (
        <Heading as='h2'>Available Cabins</Heading>
      )}
      <StyledCabinList>
        {!availableCabins?.length
          ? null
          : availableCabins.map(cabin => (
              <CabinItem key={cabin.id} cabin={cabin} />
            ))}
      </StyledCabinList>
    </>
  );
};
