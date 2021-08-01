import { formatDate } from '../misc'

describe('formatData', () => {
  it('formatData formats the date to look nice', () => {
    const year = 1987;
    const month = 9; // october
    const date = formatDate(new Date(year, month));
    expect(date).toBe('Oct 87');
  });
});
