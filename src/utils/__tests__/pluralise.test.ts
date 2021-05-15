import pluralise from '../pluralise';

it('pluralises strings with multiple placeholders', async () => {
  expect(pluralise('@count string occuring @count time', '', 1)).toBe('1 string occuring 1 time');
  expect(pluralise('', '@count strings occuring @count times', 5)).toBe('5 strings occuring 5 times');
});