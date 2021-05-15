const { isBookingRecordValid } = require('../bookings/validation')

const addBooking = (store) => (bookingRecord, isNew = true) => {
  if (!isBookingRecordValid(bookingRecord)) {
    throw new Error(`Booking record is invalid. Provided with: ${JSON.stringify(bookingRecord)}`)
  }

  store.push({
    time: Date.parse(bookingRecord.time),
    duration: bookingRecord.duration * 60 * 1000, // mins into ms
    userId: bookingRecord.user_id,
    isNew,
  })
  
  return store
};

const addBookings = (store) => (data, isNew = true) => {
  data.forEach(item => addBooking(store)(item, isNew));
  
  return store
}

function createBookingsStore(initialData) {
  const store = [];

  addBookings(store)(initialData, false)

  return {
    addBookings: addBookings(store),
    addBooking: addBooking(store),
    getData: () => store,
  };
}

module.exports = createBookingsStore;
