import { Booking, BookingRecord } from '../types/Booking'
import csvParse from 'csv-parse';

const convertCSVToDraftBookings = async (csvFile: File): Promise<Booking[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
  
    reader.addEventListener('load', (e) => {
      csvParse(e?.target?.result as string, {
        columns: true,
        ltrim: true
      }, (err, bookingRecords: BookingRecord[]) => {
        if (err) {
          reject(err);
        }
        
        const bookings: Booking[] = bookingRecords.map(({ time, duration, ...restOfBookingRecord }) => ({
          ...restOfBookingRecord,
          date: new Date(time),
          duration: duration * 60 * 1000, // Convert mins to
          isDraft: true,
        }))
        resolve(bookings);
      });
    });
    reader.addEventListener('error', reject);
    reader.readAsText(csvFile);
  });
};

export default convertCSVToDraftBookings;
