import React, { useMemo } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  concat,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@src/hooks/use-auth.ts';
import { ApiContext } from '@src/contexts/api/apiContext.tsx';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();

  const apollo = useMemo(() => {
    const httpLink = new HttpLink({
      uri: GLOBAL_CONSTANTS.GQL_ENDPOINT,
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        Authorization: session?.info?.idToken ? `Bearer ${session?.info?.idToken}` : '',
      },
    }));

    return new ApolloClient({
      link: concat(authLink, httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
        query:      { fetchPolicy: 'network-only', errorPolicy: 'all' },
        mutate:     { errorPolicy: 'all' },
      },
    });
  }, [session]);

  return (
    <ApiContext.Provider value={{ apollo }}>
      <ApolloProvider client={apollo}>{children}</ApolloProvider>
    </ApiContext.Provider>
  );
};
