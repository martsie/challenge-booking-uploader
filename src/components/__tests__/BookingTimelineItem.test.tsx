import { render, screen, fireEvent } from '@testing-library/react';
import BookingTimelineItem from '../BookingTimelineItem';

const testBooking = {
  userId: 'user-1',
  date: new Date('2020-05-01T10:00'),
  duration: 20 * 1000 * 60,
}

it('renders booking fields in timeline items', () => {
  render((
    <BookingTimelineItem
      booking={testBooking}
      isValid
      isActive
      onSelect={jest.fn()}
    />
  ));

  expect(screen.getByText('User: user-1')).toBeInTheDocument();
  expect(screen.getByText('10:00am')).toBeInTheDocument();
  expect(screen.getByText('(20 mins)')).toBeInTheDocument();
});

it('allows bookings to be selected', () => {
  const onSelect = jest.fn();
  render((
    <BookingTimelineItem
      booking={testBooking}
      isValid
      isActive={false}
      onSelect={onSelect}
    />
  ))
  fireEvent.click(screen.getByRole('checkbox'));

  expect(onSelect).toBeCalledTimes(1);
  expect(onSelect).toBeCalledWith(testBooking);
});

it('renders active state', () => {
  render((
    <BookingTimelineItem
      booking={testBooking}
      isValid
      isActive
      onSelect={jest.fn()}
    />
  ))

  const timelineItem = screen.getByRole('checkbox');
  expect(timelineItem).toHaveAttribute('aria-checked', 'true');
  expect(timelineItem).toHaveAttribute('class', 'booking-timeline-item booking-timeline-item--active');
});

it('renders inactive state', () => {
  render((
    <BookingTimelineItem
      booking={testBooking}
      isValid
      isActive={false}
      onSelect={jest.fn()}
    />
  ))

  const timelineItem = screen.getByRole('checkbox');
  expect(timelineItem).toHaveAttribute('aria-checked', 'false');
  expect(timelineItem).toHaveAttribute('class', 'booking-timeline-item');
});

it('renders error state', () => {
  render((
    <BookingTimelineItem
      booking={testBooking}
      isValid={false}
      isActive={false}
      onSelect={jest.fn()}
    />
  ))

  const timelineItem = screen.getByRole('checkbox');
  expect(timelineItem).toHaveAttribute('class', 'booking-timeline-item booking-timeline-item--error');
});

it('renders draft state', () => {
  render((
    <BookingTimelineItem
      booking={{ ...testBooking, isDraft: true }}
      isValid
      isActive={false}
      onSelect={jest.fn()}
    />
  ))

  const timelineItem = screen.getByRole('checkbox');
  expect(timelineItem).toHaveAttribute('class', 'booking-timeline-item booking-timeline-item--draft');
});
