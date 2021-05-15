import { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import './App.css'
import BookingTimelineItem from './components/BookingTimelineItem';
import Timeline from './components/Timeline';
import { Booking, BookingRecord } from './types/Booking';

const apiUrl = 'http://localhost:3001'

export const App = () => {
  const [bookings, setBookings] = useState<Booking[]>([])

  const sortAndSetBookings = (bookingRecords: BookingRecord[]) => {
    bookingRecords.sort((a, b) => a.time > b.time ? 1 : -1);
    setBookings(bookingRecords.map(({ time, ...restOfBookingRecord }) => ({
      date: new Date(time),
      ...restOfBookingRecord,
    })));
  }

  useEffect(() => {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then(sortAndSetBookings)
  }, [])

  const onDrop = async (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    fetch(`${apiUrl}/bookings/batch`, {
      method: 'POST',
      body: formData
    }).then(response => response.json())
      .then(sortAndSetBookings)
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
          items={bookings}
          itemHeight={80}
          itemWidthMsMultipler={0.00001}
          renderItem={(booking) => (
            <BookingTimelineItem booking={booking} />
          )}
        />
      </div>
      <div className='App-main'>
        <p>Existing bookings:</p>
        {bookings.map((booking, i) => {
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
