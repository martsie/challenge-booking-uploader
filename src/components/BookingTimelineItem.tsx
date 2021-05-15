import { Booking } from '../types/Booking';
import './BookingTimelineItem.css';

interface BookingTimelineItemProps {
  booking: Booking;
}

const BookingTimelineItem: React.FC<BookingTimelineItemProps> = (props) => {
  const { booking } = props;
  return (
    <div className="booking-timeline-item booking-timeline-item--current">
      User: {booking.userId}
      {booking.isDraft ? 'Is draft' : ''}
    </div>
  );
};

export default BookingTimelineItem;
