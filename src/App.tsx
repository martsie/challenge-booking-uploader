import { Interval, areIntervalsOverlapping } from 'date-fns';
import { useState, useEffect, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import './App.css'
import BookingTimelineItem from './components/BookingTimelineItem';
import Timeline from './components/Timeline';
import { Booking, BookingRecord } from './types/Booking';
import convertCSVToBookings from './utils/convertCSVToBookings';


const apiUrl = 'http://localhost:3001';

const processBookingResponse = (bookingRecords: BookingRecord[]) => {
  return bookingRecords.map(({ time, ...restOfBookingRecord }) => ({
    date: new Date(time),
    ...restOfBookingRecord,
  }));
}

export const App = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [draftBookings, setDraftBookings] = useState<Booking[]>([])
  const [selectedDraftBookings, setSelectedDraftBookings] = useState<Booking[]>([]);
  
  const sortedBookings = useMemo(() => {
    return bookings.slice(0).concat(draftBookings).sort((a, b) => a.date.getTime() > b.date.getTime() ? 1 : -1);
  }, [bookings, draftBookings]);
  
  const bookingIntervals: Interval[] = useMemo(() => {
    return sortedBookings.map(booking => {
      return {
        start: booking.date,
        end: new Date(booking.date.getTime() + booking.duration),
      };
    });
  }, [sortedBookings]);
  
  const doesBookingOverlap = (booking: Booking) => {
    const bookingIndex = sortedBookings.indexOf(booking);
    return bookingIntervals.some((bookingInterval, index) => {
      return (index !== bookingIndex && areIntervalsOverlapping(bookingInterval, bookingIntervals[bookingIndex]));
    })
  };
  

  useEffect(() => {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then(processBookingResponse)
      .then(setBookings)
  }, [])

  const onDrop = async (files: File[]) => {
    const bookingGroups:Booking[][] = await Promise.all(files.map(convertCSVToBookings));
    setDraftBookings(draftBookings.slice(0).concat(...bookingGroups));
  }
  
  const toggleSelectedDraftBooking = (booking: Booking) => {
    const currentIndex = selectedDraftBookings.indexOf(booking);
    if (currentIndex > -1) {
      const newDraftBookings = selectedDraftBookings.slice(0);
      newDraftBookings.splice(currentIndex, 1)
      setSelectedDraftBookings(newDraftBookings);
    }
    else {
      setSelectedDraftBookings([...selectedDraftBookings, booking]);
    }
  }

  return (
    <div className='App'>
      <div className='App-header'>
        <Dropzone
          accept='.csv'
          onDrop={onDrop}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <div className="timeline">
        <Timeline<Booking>
          items={sortedBookings}
          itemHeight={80}
          itemWidthMsMultipler={0.00001}
          renderTimelineItem={(booking) => (
            <BookingTimelineItem
              booking={booking}
              isValid={bookings.includes(booking) || !doesBookingOverlap(booking)}
              onSelect={toggleSelectedDraftBooking}
              isActive={selectedDraftBookings.includes(booking)}
            />
          )}
        />
      </div>
      <div className='App-main'>
        <p>Existing bookings:</p>
        {sortedBookings.map((booking, i) => {
          const date = booking.date;
          const duration = booking.duration / (60 * 1000)
          return (
            <p key={i} className='App-booking'>
              <span className='App-booking-time'>{date.toString()}</span>
              <span className='App-booking-duration'>
                {duration.toFixed(1)}
              </span>
              <span className='App-booking-user'>{booking.userId}</span>
            </p>
          )
        })}
      </div>
    </div>
  )
}
