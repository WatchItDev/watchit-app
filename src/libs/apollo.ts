import { ApolloClient, InMemoryCache, HttpLink, concat } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

const httpLink = new HttpLink({
  uri: GLOBAL_CONSTANTS.GQL_ENDPOINT,
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
