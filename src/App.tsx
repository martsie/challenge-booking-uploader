import { Interval, areIntervalsOverlapping } from 'date-fns'
import { useState, useEffect, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import './App.css'
import BookingTimelineItem from './components/BookingTimelineItem'
import Timeline from './components/Timeline'
import Button from './components/widgets/Button'
import { Booking, BookingRecord } from './types/Booking'
import convertCSVToDraftBookings from './utils/convertCSVToDraftBookings'
import pluralise from './utils/pluralise'

const apiUrl = 'http://localhost:3001'

const processBookingResponse = (bookingRecords: BookingRecord[]) => {
  return bookingRecords.map(({ time, ...restOfBookingRecord }) => ({
    date: new Date(time),
    ...restOfBookingRecord,
  }))
}

export const App = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [draftBookings, setDraftBookings] = useState<Booking[]>([])
  const [selectedDraftBookings, setSelectedDraftBookings] = useState<Booking[]>([])

  const sortedBookings = useMemo(() => {
    return bookings.slice(0).concat(draftBookings).sort((a, b) => a.date.getTime() > b.date.getTime() ? 1 : -1)
  }, [bookings, draftBookings])

  const bookingIntervals: Interval[] = useMemo(() => {
    return sortedBookings.map(booking => {
      return {
        start: booking.date,
        end: new Date(booking.date.getTime() + booking.duration),
      }
    })
  }, [sortedBookings])

  const doesBookingOverlap = (booking: Booking) => {
    const bookingIndex = sortedBookings.indexOf(booking)
    return bookingIntervals.some((bookingInterval, index) => {
      return (index !== bookingIndex && areIntervalsOverlapping(bookingInterval, bookingIntervals[bookingIndex]))
    })
  }
  
  const fetchLatestBookings = async () => {
    const newBookings = await fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then(processBookingResponse)
    setBookings(newBookings)
    setDraftBookings([])
    setSelectedDraftBookings([])
  }

  useEffect(() => {
    fetchLatestBookings()
  }, [])

  const onDrop = async (files: File[]) => {
    const bookingGroups: Booking[][] = await Promise.all(files.map(convertCSVToDraftBookings))
    setDraftBookings(draftBookings.slice(0).concat(...bookingGroups))
  }
  
  const presentError = (e: Error) => {
    alert(e.message)
  }
  
  const onSaveEvents = async () => {
    try {
      const bookingInputToSubmit = selectedDraftBookings.map(booking => ({
        user_id: booking.userId,
        duration: booking.duration / 60 / 1000,
        time: booking.date.toISOString(),
      }))
      const response = await fetch(`${apiUrl}/bookings/batch`, {
        method: 'POST',
        body: JSON.stringify(bookingInputToSubmit),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 422) {
        const responseJson = await response.json()
        throw new Error(responseJson.message)
      }
      fetchLatestBookings()
    } catch (e) {
      presentError(e)
    }
  }

  const toggleSelectedDraftBooking = (booking: Booking) => {
    if (!booking.isDraft) {
      return
    }

    if (doesBookingOverlap(booking)) {
      alert(`This booking overlaps with another booking`)
      return
    }

    const currentIndex = selectedDraftBookings.indexOf(booking)
    if (currentIndex > -1) {
      const newDraftBookings = selectedDraftBookings.slice(0)
      newDraftBookings.splice(currentIndex, 1)
      setSelectedDraftBookings(newDraftBookings)
    }
    else {
      setSelectedDraftBookings([...selectedDraftBookings, booking])
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
      {selectedDraftBookings.length > 0 && (
        <div className="App-toolbar">
          <Button onClick={onSaveEvents}>
            {pluralise('Save @count selected event', 'Save @count selected events', selectedDraftBookings.length)}
          </Button>
        </div>
      )}
    </div>
  )
}
