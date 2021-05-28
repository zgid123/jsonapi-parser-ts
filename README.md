A lightweight parser for JSON:API response format.

# Installation

```sh
npm install jsonapi-parser-ts --save

# or

yarn add jsonapi-parser-ts
```

# Example

Assume we have response like this below

```js
{
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
  ],
}
```

- Parse response as flatten

```ts
import parseJsonApi from 'jsonapi-parser';

interface IResponseProps {
  articles: {
    [key: string]: {
      id: string;
      title: string;
      author: string;
      comments: string[];
    };
  };
  people: {
    [key: string]: {
      id: string;
      firstName: string;
      lastName: string;
      twitter: string;
      addresses: string[];
    };
  };
  comments: {
    [key: string]: {
      id: string;
      body: string;
      author: string;
    };
  };
  addresses: {
    [key: string]: {
      id: string;
      street: string;
    };
  };
}

parseJsonApi<IResponseProps>(response);

// or

parseJsonApi<IResponseProps>(response, { mode: 'flatten' });

// result will be

// {
//   articles: {
//     1: {
//       id: '1',
//       title: 'JSON:API paints my bikeshed!',
//       author: '9',
//       comments: ['5', '12'],
//     },
//   },
//   people: {
//     9: {
//       id: '9',
//       firstName: 'Dan',
//       lastName: 'Gebhardt',
//       twitter: 'dgeb',
//       addresses: ['1'],
//     },
//   },
//   comments: {
//     5: {
//       id: '5',
//       body: 'First!',
//       author: '2',
//     },
//     12: {
//       id: '12',
//       body: 'I like XML better',
//       author: '9',
//     },
//   },
//   addresses: {
//     1: {
//       id: '1',
//       street: 'Avenue Q',
//     },
//   },
// }
```

- Parse response as mapping

```ts
import parseJsonApi from 'jsonapi-parser';

interface IResponseProps {
  articles: {
    id: string;
    title: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      twitter: string;
      addresses: {
        id: string;
        street: string;
      }[];
    };
    comments: {
      id: string;
      body: string;
      author: {
      id: string;
      firstName: string;
      lastName: string;
      twitter: string;
      addresses: {
        id: string;
        street: string;
      }[];
    }[];
  }[];
}

parseJsonApi<IResponseProps>(response, { mode: 'mapping' });

// result will be

// [
//   {
//     id: '1',
//     title: 'JSON:API paints my bikeshed!',
//     author: {
//       id: '9',
//       firstName: 'Dan',
//       lastName: 'Gebhardt',
//       twitter: 'dgeb',
//       addresses: [
//         {
//           id: '1',
//           street: 'Avenue Q',
//         },
//       ],
//     },
//     comments: [
//       {
//         id: '5',
//         body: 'First!',
//       },
//       {
//         id: '12',
//         body: 'I like XML better',
//         author: {
//           id: '9',
//           firstName: 'Dan',
//           lastName: 'Gebhardt',
//           twitter: 'dgeb',
//           addresses: [
//             {
//               id: '1',
//               street: 'Avenue Q',
//             },
//           ],
//         },
//       },
//     ],
//   },
// ]
```

# TODO

- improve type for typescript
- parse with links, meta attributes
