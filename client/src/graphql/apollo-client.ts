import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql', // This will be proxied to the Express server in development
});

// Configure Apollo Client with in-memory cache
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          snippets: {
            // Merge policy for snippets query to handle different filter combinations
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  // Enable dev tools in development
  connectToDevTools: import.meta.env.DEV,
  // Default options for queries and mutations
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
