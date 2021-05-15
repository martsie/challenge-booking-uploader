import { Booking } from '../types/Booking';
import './BookingTimelineItem.css';

interface BookingTimelineItemProps {
  booking: Booking;
  isValid: boolean;
  isActive: boolean;
  onSelect(booking: Booking): void;
}

const BookingTimelineItem: React.FC<BookingTimelineItemProps> = (props) => {
  const { booking, isValid, onSelect, isActive } = props;
  
  const classes = ['booking-timeline-item'];
  if (booking.isDraft) {
    classes.push('booking-timeline-item--draft');
  }
  if (!isValid) {
    classes.push('booking-timeline-item--error');
  }
  if (isActive) {
    classes.push('booking-timeline-item--active');
  }
  
  return (
    <button
      className={classes.join(' ')}
      onClick={booking.isDraft ? () => onSelect(booking) : undefined}
      type="button"
    >
      User: {booking.userId}
      {booking.isDraft ? 'Is draft' : ''}
    </button>
  );
};

export default BookingTimelineItem;
