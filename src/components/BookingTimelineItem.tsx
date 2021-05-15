import { Booking } from '../types/Booking';
import './BookingTimelineItem.css';

interface BookingTimelineItemProps {
  booking: Booking;
  isValid: boolean;
}

const BookingTimelineItem: React.FC<BookingTimelineItemProps> = (props) => {
  const { booking, isValid } = props;
  return (
    <div className={`booking-timeline-item ${booking.isDraft ? 'booking-timeline-item--draft' : 'booking-timeline-item--current'} ${isValid ? '' : 'booking-timeline-item--error'}`}>
      User: {booking.userId}
      {booking.isDraft ? 'Is draft' : ''}
    </div>
  );
};

export default BookingTimelineItem;
