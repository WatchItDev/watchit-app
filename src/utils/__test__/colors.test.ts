import { darken } from '@src/utils/colors';

describe('[UTILS]: darken', () => {
  it('matches the snapshot for different color variations', () => {
    expect([
      darken('#FFFFFF'),
      darken('#000000'),
      darken('#FF5500'),
      darken('#102030', 15),
      darken('#AABBCC', 40),
    ]).toMatchSnapshot();
  });
  it('darkens a color by the default amount', () => {
    expect(darken('#FFFFFF')).toBe('#e1e1e1');
  });

  it('darkens a color by a specified amount', () => {
    expect(darken('#FFFFFF', 50)).toBe('#cdcdcd');
  });

  it('handles already dark colors', () => {
    expect(darken('#222222', 20)).toBe('#0e0e0e');
  });

  it('prevents RGB values from going below 0', () => {
    expect(darken('#000000', 10)).toBe('#000000');
  });

  it('handles mixed RGB values correctly', () => {
    expect(darken('#FF5500', 15)).toBe('#f04600');
  });

  it('correctly pads single-digit hex values with leading zeros', () => {
    expect(darken('#102030', 10)).toBe('#061626');
  });
});
