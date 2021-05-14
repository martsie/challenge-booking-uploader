const express = require('express')
const cors = require('cors')
const { default: bookingsController } = require('./controllers/bookingsController')

const app = express()
app.use(cors()) // so that app can access

app.get('/bookings', bookingsController);

app.listen(3001)
