const { Router } = require('express');
const fs = require('fs')

const bookings = JSON.parse(fs.readFileSync('./server/bookings.json')).map(
  (bookingRecord) => ({
    time: Date.parse(bookingRecord.time),
    duration: bookingRecord.duration * 60 * 1000, // mins into ms
    userId: bookingRecord.user_id,
  }),
)

const bookingsRouter = Router()

bookingsRouter.get('/', (_, res) => {
  res.json(bookings)
})

bookingsRouter.post('/batch', (req, res) => {
  console.log(req)
});

module.exports = bookingsRouter
