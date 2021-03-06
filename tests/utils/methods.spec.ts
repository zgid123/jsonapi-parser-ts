import { jsonApi } from '../fixtures';
import { extractData, extractIncluded } from '../../src/utils/methods';

test('extract data as flatten mode', () => {
  expect(
    extractData(jsonApi.data[0]),
  ).toEqual({
    id: '1',
    title: 'JSON:API paints my bikeshed!',
    author: '9',
    comments: ['5', '12'],
    testModel: '1',
  });
});

test('extract data as mapping mode', () => {
  expect(
    extractData(jsonApi.data[0], 'mapping'),
  ).toEqual({
    id: '1',
    title: 'JSON:API paints my bikeshed!',
    relationships: {
      author: {
        id: '9',
        type: 'people',
      },
      comments: [
        {
          id: '5',
          type: 'comments',
        },
        {
          id: '12',
          type: 'comments',
        },
      ],
      testModel: {
        id: '1',
        type: 'test_models',
      },
    },
  });
});

test('extract included as flatten mode', () => {
  expect(
    extractIncluded(jsonApi.included),
  ).toEqual({
    people: {
      9: {
        id: '9',
        firstName: 'Dan',
        lastName: 'Gebhardt',
        nonExistingCollection: '123',
        twitter: 'dgeb',
        addresses: ['1'],
      },
    },
    comments: {
      5: {
        id: '5',
        body: 'First!',
        author: '2',
      },
      12: {
        id: '12',
        body: 'I like XML better',
        author: '9',
      },
    },
    addresses: {
      1: {
        id: '1',
        street: 'Avenue Q',
      },
    },
    testModels: {
      1: {
        id: '1',
        name: 'Test Name',
      },
    },
  });
});

test('extract included as mapping mode', () => {
  expect(
    extractIncluded(jsonApi.included, 'mapping'),
  ).toEqual({
    people: {
      9: {
        id: '9',
        firstName: 'Dan',
        lastName: 'Gebhardt',
        twitter: 'dgeb',
        relationships: {
          addresses: [
            { type: 'addresses', id: '1' },
          ],
          nonExistingCollection: {
            type: 'nonExistingCollection',
            id: '123',
          },
        },
      },
    },
    comments: {
      5: {
        id: '5',
        body: 'First!',
        relationships: {
          author: {
            id: '2',
            type: 'people',
          },
        },
      },
      12: {
        id: '12',
        body: 'I like XML better',
        relationships: {
          author: {
            id: '9',
            type: 'people',
          },
        },
      },
    },
    addresses: {
      1: {
        id: '1',
        street: 'Avenue Q',
        relationships: {},
      },
    },
    testModels: {
      1: {
        id: '1',
        name: 'Test Name',
        relationships: {},
      },
    },
  });
});
