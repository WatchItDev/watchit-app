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

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                       children,
                                                                     }) => {
  // const { user } = useAuth();
  const { session } = useAuth();

  const apollo = useMemo(() => {
    const httpLink = new HttpLink({
      uri: GLOBAL_CONSTANTS.GQL_ENDPOINT,
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        // Authorization: user?.idToken ? `Bearer ${user.idToken}` : '',
        Authorization: session?.address ?? '',
      },
    }));

    return new ApolloClient({
      link: concat(authLink, httpLink),
      cache: new InMemoryCache(),
    });
  }, [session]);

  return (
    <ApiContext.Provider value={{ apollo }}>
      <ApolloProvider client={apollo}>{children}</ApolloProvider>
    </ApiContext.Provider>
  );
};
