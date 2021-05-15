const { Router } = require('express')
const fs = require('fs')
const createBookingsStore = require('../bookings/createBookingsStore')

const bookingsStore = createBookingsStore(JSON.parse(fs.readFileSync('./server/bookings.json')))

const bookingsRouter = Router()

bookingsRouter.get('/', (_, res) => {
  res.json(bookingsStore.getData())
})

bookingsRouter.post('/batch', (req, res, next) => {
  try {
    bookingsStore.addBookings(req.body)
  }
  catch (e) {
    res.status(422).json({
      message: e.message,
    })
  }
  res.json({ success: true })
})

module.exports = bookingsRouter
