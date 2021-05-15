export type Seconds = number;

export type BookingBase = {
  duration: Seconds;
  userId: string;
  isNew: boolean;
}

export type BookingRecord = BookingBase & {
  time: string;
}

export type Booking = BookingBase & {
  date: Date;
}