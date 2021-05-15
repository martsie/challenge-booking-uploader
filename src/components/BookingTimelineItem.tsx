import format from 'date-fns/format'
import { Booking } from '../types/Booking'
import './BookingTimelineItem.css'

interface BookingTimelineItemProps {
  booking: Booking
  isValid: boolean
  isActive: boolean
  onSelect(booking: Booking): void
}

const BookingTimelineItem: React.FC<BookingTimelineItemProps> = (props) => {
  const { booking, isValid, onSelect, isActive } = props
  
  const classes = ['booking-timeline-item']
  if (booking.isDraft) {
    classes.push('booking-timeline-item--draft')
  }
  if (!isValid) {
    classes.push('booking-timeline-item--error')
  }
  if (isActive) {
    classes.push('booking-timeline-item--active')
  }
  
  return (
    <button
      className={classes.join(' ')}
      onClick={() => onSelect(booking)}
      type="button"
      role="checkbox"
      aria-checked={isActive}
    >
      <h2 className="booking-timeline-item__user">User: {booking.userId}</h2>
      <p className="booking-timeline-item__date">{format(booking.date, 'h:mmaaa')}</p>
      <p className="booking-timeline-item__duration">({booking.duration / 1000 / 60} mins)</p>
    </button>
  )
}

export default BookingTimelineItem
