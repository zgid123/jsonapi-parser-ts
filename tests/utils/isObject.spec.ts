import isObject from '../../src/utils/isObject';

test('check with string', () => {
  expect(isObject('test')).toBe(false);
});

test('check with number', () => {
  expect(isObject(1)).toBe(false);
});

test('check with null', () => {
  expect(isObject(null)).toBe(false);
});

test('check with undefined', () => {
  expect(isObject(undefined)).toBe(false);
});

test('check with object', () => {
  expect(isObject({})).toBe(true);
});

test('check with array', () => {
  expect(isObject([])).toBe(true);
});

test('check with boolean', () => {
  expect(isObject(true)).toBe(false);
  expect(isObject(false)).toBe(false);
});

test('check with date', () => {
  expect(isObject(new Date())).toBe(true);
});
