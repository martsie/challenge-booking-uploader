const express = require('express')
const cors = require('cors')
const bookingsRouter = require('./routers/bookingsRouter')

const app = express()
app.use(cors()) // so that app can access

app.use('/bookings', bookingsRouter)

app.listen(3001)
