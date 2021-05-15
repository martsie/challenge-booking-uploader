import convertCSVToDraftBookings from '../convertCSVToDraftBookings'

it('converts csv into booking drafts', async () => {
  const file = new File(['time, duration, userId\n', '01 Mar 2020 11:00:00 GMT+1000, 300, 0001\n', '02 Mar 2020 14:00:00 GMT+1000, 500, 0002\n'], 'bookings.csv', {type: 'text/csv'})
  const bookings = await convertCSVToDraftBookings(file)

  expect(bookings).toHaveLength(2)

  expect(bookings[0]).toMatchObject({
    duration: 18000000,
    isDraft: true,
    userId: '0001',
  })
  expect(bookings[0].date.getTime()).toBe(1583024400000)

  expect(bookings[1]).toMatchObject({
    duration: 30000000,
    isDraft: true,
    userId: '0002',
  })
  expect(bookings[1].date.getTime()).toBe(1583121600000)
})