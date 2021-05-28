import isDate from '../../src/utils/isDate';

test('check with string', () => {
  expect(isDate('test')).toBe(false);
});

test('check with number', () => {
  expect(isDate(1)).toBe(false);
});

test('check with null', () => {
  expect(isDate(null)).toBe(false);
});

test('check with undefined', () => {
  expect(isDate(undefined)).toBe(false);
});

test('check with object', () => {
  expect(isDate({})).toBe(false);
});

test('check with array', () => {
  expect(isDate([])).toBe(false);
});

test('check with boolean', () => {
  expect(isDate(true)).toBe(false);
  expect(isDate(false)).toBe(false);
});

test('check with date', () => {
  expect(isDate(new Date())).toBe(true);
});
