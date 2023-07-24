import { styled } from 'styled-components';
import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import {
  HiArrowTrendingDown,
  HiOutlineArrowDown,
  HiOutlineArrowTrendingDown,
  HiOutlineCurrencyDollar,
  HiOutlineMoon,
  HiOutlineUserGroup,
} from 'react-icons/hi2';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

const StyledCabinItem = styled.li`
  background-color: var(--color-grey-0);
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1rem;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`;

const Img = styled.img`
  border-bottom-left-radius: var(--border-radius-sm);
  border-top-left-radius: var(--border-radius-sm);
`;

const CabinInfo = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const IconData = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

export const CabinItem = ({ cabin }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id, name, maxCapacity, regularPrice, image, discount } = cabin;

  const nights = differenceInDays(
    new Date(searchParams.get('to')),
    new Date(searchParams.get('from'))
  );

  return (
    <StyledCabinItem>
      <Img src={image} alt={`Cabin ${name}`} />
      <CabinInfo>
        <Row>
          <Row type='horizontal'>
            <Heading as='h2'>Cabin #{name}</Heading>
          </Row>
          <Row type='horizontal'>
            <IconData>
              <HiOutlineUserGroup />
              {maxCapacity}
            </IconData>
            <IconData>
              <HiOutlineMoon />
              {nights}
            </IconData>
            <IconData>
              <HiOutlineCurrencyDollar />
              {formatCurrency(regularPrice - discount)}
            </IconData>
          </Row>
        </Row>
        <Row>
          <Button size='medium' onClick={() => navigate(`/new-booking/${id}`)}>
            Book now
          </Button>
        </Row>
      </CabinInfo>
    </StyledCabinItem>
  );
};
