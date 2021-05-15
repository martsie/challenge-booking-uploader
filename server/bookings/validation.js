function isBookingRecordValid(csvRow) {
  return !!(csvRow.time && csvRow.duration && csvRow.user_id);
}

module.exports = { isBookingRecordValid }