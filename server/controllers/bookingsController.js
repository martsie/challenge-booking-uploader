const { Router } = require('express');
const fs = require('fs')

const bookings = JSON.parse(fs.readFileSync('./server/bookings.json')).map(
  (bookingRecord) => ({
    time: Date.parse(bookingRecord.time),
    duration: bookingRecord.duration * 60 * 1000, // mins into ms
    userId: bookingRecord.user_id,
  }),
)

const bookingsController = () => {
  const router = Router();

  router.get('/', (_, res) => {
    res.json(bookings)
  })

  router.post('/batch', (_, res) => {
    
  });

  return router;
}

export default bookingsController;
