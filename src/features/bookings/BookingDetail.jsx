import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Spinner from '../../ui/Spinner';

import { useBooking } from './useBooking';
import { useMoveBack } from '../../hooks/useMoveBack';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../check-in-out/useCheckout';
import { HiArrowUpOnSquare, HiTrash } from 'react-icons/hi2';
import { useDeleteBooking } from './useDeleteBooking';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Empty from '../../ui/Empty';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeletingBooking } = useDeleteBooking();
  const navigate = useNavigate();

  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resource='booking' />;

  const { status, id } = booking;

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  return (
    <>
      <Row type='horizontal'>
        <HeadingGroup>
          <Heading as='h1'>Booking #{id}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      <Modal>
        <ButtonGroup>
          {status === 'unconfirmed' && (
            <Button onClick={() => navigate(`/checkin/${id}`)}>Check In</Button>
          )}
          {status === 'checked-in' && (
            <Button
              icon={<HiArrowUpOnSquare />}
              onClick={() => checkout(id)}
              disabled={isCheckingOut}
            >
              Check Out
            </Button>
          )}
          {status === 'checked-out' && (
            <Modal.Open opens='delete'>
              <Button
                icon={<HiTrash />}
                onClick={() => deleteBooking(id)}
                disabled={isDeletingBooking}
              >
                Remove booking
              </Button>
            </Modal.Open>
          )}
          <Button variation='secondary' onClick={moveBack}>
            Back
          </Button>
        </ButtonGroup>
        <Modal.Window name='delete'>
          <ConfirmDelete
            resourceName='booking'
            disabled={isDeletingBooking}
            onConfirm={() => deleteBooking(id)}
          />
        </Modal.Window>
      </Modal>
    </>
  );
}

export default BookingDetail;
