const { Router } = require('express');
const multer = require('multer')
const csvParse = require('csv-parse')
const fs = require('fs')
const createBookingsStore = require('../bookings/createBookingsStore')

const bufferToStream = require('../utils/bufferToStream')

const upload = multer(); // Default multer configuration stores files in memory.

const bookingsStore = createBookingsStore(JSON.parse(fs.readFileSync('./server/bookings.json')));

const bookingsRouter = Router()

bookingsRouter.get('/', (_, res) => {
  res.json(bookingsStore.getData())
})

const mapCSVColumnToBookingResourceColumn = (csvColumn) => {
  switch(csvColumn) {
    case 'userId':
      return 'user_id';
    
    default:
      return csvColumn;
  }
}

bookingsRouter.post('/batch', upload.array('files'), (req, res, next) => {
  const csvFiles = req.files;

  const bookingsData = [];
  csvFiles.forEach((csvFile, index) => {
    bufferToStream(csvFile.buffer).pipe(csvParse({
      columns: (firstRow) => firstRow.map(mapCSVColumnToBookingResourceColumn),
      ltrim: true
    }))
    .on('data', function(csvRow) {
      bookingsData.push(csvRow);        
    })
    .on('end',function() {
      if (index === csvFiles.length - 1) {
        try {
          bookingsStore.addBookings(bookingsData)
          res.json(bookingsStore.getData())
        } catch (e) {
          next(e);
        }
      }
    });
  })
  
});

module.exports = bookingsRouter
