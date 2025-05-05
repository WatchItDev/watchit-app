import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  concat,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GQL_ENDPOINT ?? 'http://localhost:4000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  // obtén tu JWT – depende de tu login flow (Web3Auth, wallet, etc.)
  const token = await localStorage.getItem('idToken'); // placeholder

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apollo = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});
