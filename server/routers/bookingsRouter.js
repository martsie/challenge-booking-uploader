const { Router } = require('express');
const multer = require('multer')
const csvParse = require('csv-parse')
const fs = require('fs')

const bufferToStream = require('../utils/bufferToStream')

const upload = multer(); // Default multer configuration stores files in memory.

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

bookingsRouter.post('/batch', upload.array('files'), (req, res) => {
  const csvFiles = req.files;

  const bookingsData = [];
  csvFiles.forEach((csvFile, index) => {
    bufferToStream(csvFile.buffer).pipe(csvParse({ columns: true, ltrim: true }))
    .on('data', function(csvRow) {
      bookingsData.push(csvRow);        
    })
    .on('end',function() {
      if (index === csvFiles.length - 1) {
        console.log(bookingsData, 'end');
      }
    });
  })
});

module.exports = bookingsRouter
