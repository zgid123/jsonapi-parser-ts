import parser from '../src';
import { jsonApi } from './fixtures';

test('parse json:api data as flatten mode', () => {
  expect(
    parser(jsonApi, { mode: 'flatten' }),
  ).toEqual({
    articles: {
      1: {
        id: '1',
        title: 'JSON:API paints my bikeshed!',
        author: '9',
        comments: ['5', '12'],
        testModel: '1',
      },
    },
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

test('parse json:api data as mapping mode', () => {
  expect(
    parser(jsonApi, { mode: 'mapping' }),
  ).toEqual([
    {
      id: '1',
      title: 'JSON:API paints my bikeshed!',
      author: {
        id: '9',
        firstName: 'Dan',
        lastName: 'Gebhardt',
        twitter: 'dgeb',
        addresses: [
          {
            id: '1',
            street: 'Avenue Q',
          },
        ],
      },
      comments: [
        {
          id: '5',
          body: 'First!',
        },
        {
          id: '12',
          body: 'I like XML better',
          author: {
            id: '9',
            firstName: 'Dan',
            lastName: 'Gebhardt',
            twitter: 'dgeb',
            addresses: [
              {
                id: '1',
                street: 'Avenue Q',
              },
            ],
          },
        },
      ],
      testModel: {
        id: '1',
        name: 'Test Name',
      },
    },
  ]);
});
