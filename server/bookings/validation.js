const { areIntervalsOverlapping } = require('date-fns')

function isBookingRecordValid(csvRow) {
  return !!(csvRow.time && csvRow.duration && csvRow.user_id)
}

function doesBookingRecordOverlap(bookingRecord, existingBookings) {
  // @todo This variable needs memoization.
  const bookingIntervals = existingBookings.map(booking => ({
    start: new Date(booking.time),
    end: new Date(booking.time + booking.duration),
  }))
  
  const thisBookingInterval = {
    start: new Date(bookingRecord.time),
    end: new Date(Date.parse(bookingRecord.time) + (bookingRecord.duration  * 60 * 1000)),
  }
  
  return bookingIntervals.some((bookingInterval) => {
    return areIntervalsOverlapping(bookingInterval, thisBookingInterval)
  })
}

module.exports = { isBookingRecordValid, doesBookingRecordOverlap }