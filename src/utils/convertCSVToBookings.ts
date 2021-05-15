import { Booking, BookingRecord } from '../types/Booking'
import csvParse from 'csv-parse';

const mapCSVColumnToBookingResourceColumn = (csvColumn: string) => {
  switch (csvColumn) {
    case 'userId':
      return 'user_id'

    default:
      return csvColumn
  }
}

const convertCSVToBookings = async (csvFile: File): Promise<Booking[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
  
    reader.addEventListener('load', (e) => {
      csvParse(e?.target?.result as string, {
        columns: (firstRow: string[]) => firstRow.map(mapCSVColumnToBookingResourceColumn),
        ltrim: true
      }, (err, bookingRecords: BookingRecord[]) => {
        if (err) {
          reject(err);
        }
        
        const bookings: Booking[] = bookingRecords.map(({ time, duration, ...restOfBookingRecord }) => ({
          ...restOfBookingRecord,
          date: new Date(time),
          duration: duration * 60 * 1000, // Convert mins to ms
          isDraft: true,
        }))
        resolve(bookings);
      });
    });
    reader.addEventListener('error', reject);
    reader.readAsText(csvFile);
  });
};

export default convertCSVToBookings;
