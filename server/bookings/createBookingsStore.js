const { isBookingRecordValid, doesBookingRecordOverlap } = require('../bookings/validation')

const addBooking = (store) => (bookingRecord) => {
  if (!isBookingRecordValid(bookingRecord)) {
    throw new Error(`Booking record is invalid. Provided with: ${JSON.stringify(bookingRecord)}`)
  }
  if (doesBookingRecordOverlap(bookingRecord, store)) {
    throw new Error(`Booking overlaps: ${JSON.stringify(bookingRecord)}`);
  }

  store.push({
    time: Date.parse(bookingRecord.time),
    duration: bookingRecord.duration * 60 * 1000, // mins into ms
    userId: bookingRecord.user_id,
  })
  
  return store
};

const addBookings = (store) => (data) => {
  data.forEach(item => addBooking(store)(item));
  
  return store
}

function createBookingsStore(initialData) {
  const store = [];

  addBookings(store)(initialData)

  return {
    addBookings: addBookings(store),
    addBooking: addBooking(store),
    getData: () => store,
  };
}

module.exports = createBookingsStore;
