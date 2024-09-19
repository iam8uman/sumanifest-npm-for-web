# Advanced Data Fetching Hooks

A comprehensive collection of React hooks for efficient data fetching, state management, and API interactions in React and Next.js applications.

## Table of Contents

1. [Installation](#installation)
2. [Hooks](#hooks)
   - [useDataFetch](#usedatafetch)
   - [usePaginatedFetch](#usepaginatedfetch)
   - [useInfiniteScroll](#useinfinitescroll)
   - [useDataMutation](#usedatamutation)
   - [useCancellableFetch](#usecancellablefetch)
   - [usePolling](#usepolling)
   - [useOfflineFetch](#useofflinefetch)
   - [useGraphQLQuery](#usegraphqlquery)
   - [useWebSocket](#usewebsocket)
   - [useLocalStorage](#uselocalstorage)
3. [Utilities](#utilities)
   - [RequestQueue](#requestqueue)
   - [rateLimiter](#ratelimiter)
   - [retryFetch](#retryfetch)
   - [deduplicateFetch](#deduplicatefetch)
   - [normalizeData](#normalizedata)
   - [interceptedFetch](#interceptedfetch)
4. [Reusable Types](#reusable-types)
5. [Server-Side Rendering](#server-side-rendering)
6. [Best Practices](#best-practices)
7. [Contributing](#contributing)
8. [License](#license)

## Installation

Install the package using npm:

```bash
npm install sumanifest
```

Or using yarn:

```bash
yarn add sumanifest
```

## Hooks

### useDataFetch

A versatile hook for fetching data with built-in caching and error handling.

#### Usage

```jsx
import { useDataFetch } from 'sumanifest';

function MyComponent() {
  const { data, isLoading, error, refetch } = useDataFetch('https://api.example.com/data');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refetch}>Refetch</button>
    </div>
  );
}
```

### usePaginatedFetch

A hook for handling paginated data fetching.

#### Usage

```jsx
import { usePaginatedFetch } from 'sumanifest';

function PaginatedList() {
  const { data, isLoading, error, page, goToNextPage, goToPreviousPage } = usePaginatedFetch(
    'https://api.example.com/items',
    { initialPage: 1, pageSize: 10 }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>
      <button onClick={goToPreviousPage} disabled={page === 1}>Previous</button>
      <button onClick={goToNextPage}>Next</button>
    </div>
  );
}
```

### useInfiniteScroll

A hook for implementing infinite scrolling functionality.

#### Usage

```jsx
import { useInfiniteScroll } from 'sumanifest';

function InfiniteList() {
  const { data, isLoading, error, loadMore } = useInfiniteScroll('https://api.example.com/items');

  return (
    <div>
      <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>
      {isLoading && <div>Loading more...</div>}
      {error && <div>Error: {error.message}</div>}
      <button onClick={loadMore} disabled={isLoading}>Load More</button>
    </div>
  );
}
```

### useDataMutation

A hook for performing data mutations (create, update, delete operations).

#### Usage

```jsx
import { useDataMutation } from 'sumanifest';

function CreateItemForm() {
  const { mutate, isLoading, error } = useDataMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    await mutate({
      url: 'https://api.example.com/items',
      method: 'POST',
      onSuccess: (data) => console.log('Item created:', data),
      onError: (error) => console.error('Error creating item:', error),
    }, Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <button type="submit" disabled={isLoading}>Create Item</button>
      {error && <div>Error: {error.message}</div>}
    </form>
  );
}
```

### useCancellableFetch

A hook that allows cancellation of ongoing fetch requests.

#### Usage

```jsx
import { useCancellableFetch } from 'sumanifest';

function CancellableDataFetch() {
  const { data, isLoading, error } = useCancellableFetch('https://api.example.com/data');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### usePolling

A hook for implementing polling (periodic data fetching).

#### Usage

```jsx
import { usePolling } from 'sumanifest';

function PollingComponent() {
  const { data, isLoading, error, startPolling, stopPolling } = usePolling('https://api.example.com/data', 5000);

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {isLoading && <div>Updating...</div>}
      {error && <div>Error: {error.message}</div>}
      <button onClick={startPolling}>Start Polling</button>
      <button onClick={stopPolling}>Stop Polling</button>
    </div>
  );
}
```

### useOfflineFetch

A hook that provides offline support using local storage.

#### Usage

```jsx
import { useOfflineFetch } from 'sumanifest';

function OfflineAwareComponent() {
  const { data, isLoading, error } = useOfflineFetch('https://api.example.com/data');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### useGraphQLQuery

A hook for making GraphQL queries.

#### Usage

```jsx
import { useGraphQLQuery } from 'sumanifest';

function GraphQLComponent() {
  const { data, isLoading, error } = useGraphQLQuery('https://api.example.com/graphql', {
    query: `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `,
    variables: { id: '123' },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### useWebSocket

A hook for real-time data fetching using WebSockets.

#### Usage

```jsx
import { useWebSocket } from 'sumanifest';

function WebSocketComponent() {
  const { data, isConnected, error, sendMessage } = useWebSocket('wss://api.example.com/ws');

  return (
    <div>
      <div>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {error && <div>Error: {error.message}</div>}
      <button onClick={() => sendMessage('Hello, WebSocket!')}>Send Message</button>
    </div>
  );
}
```

### useLocalStorage

A hook for easily storing and retrieving data from localStorage with TypeScript support.

#### Usage

```jsx
import { useLocalStorage } from 'sumanifest';

function LocalStorageComponent() {
  const [user, setUser] = useLocalStorage('user', { name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name: e.target.name.value, email: e.target.email.value });
  };

  return (
    
        Save
    
        Stored User: {user.name} ({user.email})
      
    
  );
}
```

## Utilities

### RequestQueue

A utility for managing multiple simultaneous requests with a concurrency limit.

#### Usage

## Reusable Types

This package includes a set of reusable TypeScript types to enhance your development experience and ensure consistency across your projects.

### Basic Types

```typescript
import { ID, BaseEntity } from 'sumanifest';

const id: ID = '123'; // or 123
const entity: BaseEntity = {
  id: '1',
  createdAt: '2023-05-20T12:00:00Z',
  updatedAt: '2023-05-20T12:00:00Z'
};
```

### User Types

```typescript
import { User } from 'sumanifest';

const user: User = {
  id: '1',
  createdAt: '2023-05-20T12:00:00Z',
  updatedAt: '2023-05-20T12:00:00Z',
  username: 'johndoe',
  email: 'john@example.com',
  isActive: true
};
```

### API Response Types

```typescript
import { ApiResponse, PaginatedResponse } from 'sumanifest';

const response: ApiResponse = {
  data: user,
  message: 'User fetched successfully',
  status: 200
};

const paginatedResponse: PaginatedResponse = {
  data: [user],
  message: 'Users fetched successfully',
  status: 200,
  totalCount: 100,
  pageSize: 10,
  currentPage: 1
};
```

### Form Types

```typescript
import { FormState } from 'sumanifest';

const formState: FormState = {
  values: user,
  errors: { email: 'Invalid email format' },
  isSubmitting: false
};
```

### Utility Types

```typescript
import { Nullable, DeepPartial, AsyncFunction } from 'sumanifest';

const nullableUser: Nullable = null;
const partialUser: DeepPartial = { username: 'johndoe' };
const asyncFunc: AsyncFunction = async () => user;
```

These types can be used throughout your application to ensure type safety and improve developer productivity.

```javascript
import { RequestQueue } from 'sumanifest';

async function fetchWithQueue() {
  const queue = new RequestQueue(2); // Allow 2 concurrent requests

  const urls = [
    'https://api.example.com/data1',
    'https://api.example.com/data2',
    'https://api.example.com/data3',
    'https://api.example.com/data4'
  ];

  const fetchData = async (url) => {
    const response = await fetch(url);
    return response.json();
  };

  const results = await Promise.all(
    urls.map(url => queue.enqueue(() => fetchData(url)))
  );

  console.log('All requests completed:', results);
}
```

### rateLimiter

A utility for implementing rate limiting on API requests.

#### Usage

```javascript
import { rateLimiter } from 'sumanifest';

const limitedFetch = rateLimiter(5, 1000); // 5 requests per second

async function fetchData() {
  try {
    const response = await limitedFetch(() => fetch('https://api.example.com/data'));
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Rate limit exceeded:', error);
  }
}
```

### retryFetch

A utility for automatically retrying failed requests with exponential backoff.

#### Usage

```javascript
import { retryFetch } from 'sumanifest';

async function fetchWithRetry() {
  try {
    const response = await retryFetch('https://api.example.com/data', {}, 3, 1000);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('All retry attempts failed:', error);
  }
}
```

### deduplicateFetch

A utility for avoiding duplicate requests for the same data.

#### Usage

```javascript
import { deduplicateFetch } from 'sumanifest';

async function fetchData() {
  const response1 = await deduplicateFetch('https://api.example.com/data');
  const response2 = await deduplicateFetch('https://api.example.com/data');
  // response1 and response2 will be the same Promise, avoiding duplicate requests
}
```

### normalizeData

A utility for normalizing nested API responses.

#### Usage

```javascript
import { normalizeData } from 'sumanifest';

const apiResponse = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
];

const normalizedData = normalizeData(apiResponse);
console.log(normalizedData);
// Output: { entities: { '1': { id: 1, name: 'John' }, '2': { id: 2, name: 'Jane' } }, ids: [1, 2] }
```

### interceptedFetch

A utility for adding request and response interceptors.

#### Usage

```javascript
import { interceptedFetch, addRequestInterceptor, addResponseInterceptor } from 'sumanifest';

addRequestInterceptor((config) => {
  config.headers = { ...config.headers, 'Authorization': 'Bearer token' };
  return config;
});

addResponseInterceptor((response) => {
  console.log('Response received:', response);
  return response;
});

async function fetchData() {
  const response = await interceptedFetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
}
```

## Server-Side Rendering

For server-side rendering support in Next.js applications, use the `ssrDataFetch` function:

```javascript
import { ssrDataFetch } from 'sumanifest';

export async function getServerSideProps() {
  const data = await ssrDataFetch('https://api.example.com/data');
  return { props: { data } };
}
```

## Best Practices

1. Use the appropriate hook for your use case to optimize performance and user experience.
2. Implement error handling and loading states in your components.
3. Use the `RequestQueue` utility to manage multiple simultaneous requests and avoid overwhelming the server.
4. Implement rate limiting to comply with API usage limits.
5. Use the `deduplicateFetch` utility to avoid unnecessary duplicate requests.
6. Normalize complex data structures using the `normalizeData` utility for easier state management.
7. Implement offline support using `useOfflineFetch` for better user experience in unreliable network conditions.
8. Use `interceptedFetch` to add global request/response handling, such as authentication headers or logging.

## Contributing

We welcome contributions to this project! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
```
<hr/>

If you're using yarn:

```shellscript
yarn add @sumanifest/useDataFetch
```

## Usage

Here's a basic example of how to use the `useDataFetch` hook:

```javascriptreact
import { useDataFetch } from 'sumanifest';

function MyComponent() {
  const { data, isLoading, error } = useDataFetch('https://api.example.com/data');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

### With Query Parameters

You can easily include query parameters in your requests:

```javascriptreact
import { useDataFetch } from 'sumanifest';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error, refetch } = useDataFetch(
    \`https://api.example.com/search?q=\${encodeURIComponent(searchTerm)}\`
  );

  const handleSearch = () => {
    refetch();
  };

  // ... render component
}
```

### POST Request

Here's how you can make a POST request:

```javascriptreact
import { useDataFetch } from 'sumanifest';

function CreatePostComponent() {
  const { data, isLoading, error, updateOptions } = useDataFetch('https://api.example.com/posts');

  const createPost = (title, body) => {
    updateOptions({
      method: 'POST',
      body: JSON.stringify({ title, body }),
    });
  };

  // ... render component
}
```

### Updating Options

You can update the fetch options dynamically:

```javascriptreact
import { useDataFetch } from 'sumanifest';

function DynamicFetchComponent() {
  const { data, isLoading, error, updateOptions } = useDataFetch('https://api.example.com/data');

  const addAuthHeader = (token) => {
    updateOptions({
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });
  };

  // ... render component
}
```

## API

### useDataFetch`<T>`(url: string, options?: FetchOptions)

#### Parameters

- `url`: The URL to fetch data from.
- `options`: (Optional) An object containing fetch options.


#### Returns

An object with the following properties:

- `data`: The fetched data (type T).
- `isLoading`: A boolean indicating whether the request is in progress.
- `error`: Any error that occurred during the fetch, or null if no error.
- `refetch`: A function to manually trigger a refetch.
- `updateOptions`: A function to update the fetch options.


#### FetchOptions

The `options` parameter extends the standard `RequestInit` interface and includes:

- `method`: The HTTP method to use (GET, POST, PUT, DELETE, PATCH).
- `headers`: An object containing request headers.
- `body`: The body of the request (for POST, PUT, etc.).


## Caching

`useDataFetch` implements a simple in-memory cache to avoid unnecessary network requests. The default cache duration is 5 minutes, but this can be adjusted in the implementation if needed.

## Error Handling

The hook provides an `error` property in its return value. This will be `null` if no error occurred, or an `Error` object if an error was encountered during the fetch operation.

## TypeScript Support

`useDataFetch` is written in TypeScript and provides full type support. You can specify the expected type of your data as a type parameter:

```typescript
const { data, isLoading, error } = useDataFetch<MyDataType>('https://api.example.com/data');
```

## Best Practices

1. Always handle loading and error states in your components.
2. Use the `updateOptions` function to dynamically change request parameters instead of changing the URL or recreating the hook.
3. Utilize the caching feature by keeping URLs consistent for the same data.
4. When working with forms or user input, consider debouncing or throttling your requests to avoid unnecessary API calls.


## Contributing

We welcome contributions to `useDataFetch`! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
