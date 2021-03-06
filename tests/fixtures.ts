export const jsonApi = {
  data: [
    {
      type: 'articles',
      id: '1',
      attributes: {
        title: 'JSON:API paints my bikeshed!',
      },
      relationships: {
        author: {
          data: { type: 'people', id: '9' },
        },
        comments: {
          data: [
            { type: 'comments', id: '5' },
            { type: 'comments', id: '12' },
          ],
        },
        testModel: {
          data: { type: 'test_models', id: '1' },
        },
      },
    },
  ],
  included: [
    {
      type: 'people',
      id: '9',
      attributes: {
        firstName: 'Dan',
        lastName: 'Gebhardt',
        twitter: 'dgeb',
      },
      relationships: {
        addresses: {
          data: [
            { type: 'addresses', id: '1' },
          ],
        },
        nonExistingCollection: {
          data: {
            id: '123',
            type: 'nonExistingCollection',
          },
        },
      },
    },
    {
      type: 'comments',
      id: '5',
      attributes: {
        body: 'First!',
      },
      relationships: {
        author: {
          data: { type: 'people', id: '2' },
        },
      },
    },
    {
      type: 'comments',
      id: '12',
      attributes: {
        body: 'I like XML better',
      },
      relationships: {
        author: {
          data: { type: 'people', id: '9' },
        },
      },
    },
    {
      type: 'addresses',
      id: '1',
      attributes: {
        street: 'Avenue Q',
      },
    },
    {
      type: 'test_models',
      id: '1',
      attributes: {
        name: 'Test Name',
      },
    },
  ],
};
