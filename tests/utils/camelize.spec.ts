
import { camelize, camelizeKeys } from '../../src/utils/camelize';

test('camelize string as snake_case', () => {
  expect(camelize('test_field')).toBe('testField');
});

test('camelize string as camelCase', () => {
  expect(camelize('testField')).toBe('testField');
});

test('camelize string as hyphen-case', () => {
  expect(camelize('test-field')).toBe('testField');
});

test('camelize string that has slash character', () => {
  expect(camelize('test/field')).toBe('testField');
});

const result = {
  fieldA: 'test field a',
  fieldB: 'test field b',
  fieldC: {
    nestedField: {
      nestedFieldLevel2: 'test nested field',
    },
    arrayField: [
      'test value',
    ],
    arrayWithNestedArray: [
      ['test value'],
      [{ testField: 'test field' }],
    ],
  },
};

test('camelize all keys of object has snake_case keys', () => {
  expect(
    camelizeKeys({
      field_a: 'test field a',
      field_b: 'test field b',
      field_c: {
        nested_field: {
          nested_field_level_2: 'test nested field',
        },
        array_field: [
          'test value',
        ],
        array_with_nested_array: [
          ['test value'],
          [{ test_field: 'test field' }],
        ],
      },
    }),
  ).toEqual(result);
});

test('camelize all keys of object has camelCase keys', () => {
  expect(
    camelizeKeys({
      fieldA: 'test field a',
      fieldB: 'test field b',
      fieldC: {
        nestedField: {
          nestedFieldLevel2: 'test nested field',
        },
        arrayField: [
          'test value',
        ],
        arrayWithNestedArray: [
          ['test value'],
          [{ testField: 'test field' }],
        ],
      },
    }),
  ).toEqual(result);
});

test('camelize all keys of object has hyphen-case keys', () => {
  expect(
    camelizeKeys({
      'field-a': 'test field a',
      'field-b': 'test field b',
      'field-c': {
        'nested-field': {
          'nested-field-level-2': 'test nested field',
        },
        'array-field': [
          'test value',
        ],
        'array-with-nested-array': [
          ['test value'],
          [{ 'test-field': 'test field' }],
        ],
      },
    }),
  ).toEqual(result);
});
