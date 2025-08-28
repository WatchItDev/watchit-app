import React, { useMemo } from 'react';
import { createClient } from "graphql-ws";
import { OperationTypeNode } from "graphql";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  concat, split
} from '@apollo/client';
import { useAuth } from '@src/hooks/use-auth.ts';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from '@apollo/client/link/context';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();

  const apollo = useMemo(() => {
    const httpLink = new HttpLink({
      uri: GLOBAL_CONSTANTS.GQL_ENDPOINT,
    });

    // https://www.apollographql.com/docs/react/data/subscriptions
    const wsLink = new GraphQLWsLink(
      createClient({
        url: `ws://localhost:4000/subscriptions`
      })
    );

    const splitLink = split(
      ({ operationName }) => operationName === OperationTypeNode.SUBSCRIPTION,
      wsLink, httpLink
    );

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        Authorization: session?.info?.idToken ? `Bearer ${session?.info?.idToken}` : '',
      },
    }));

    return new ApolloClient({
      link: concat(authLink, splitLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
        query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
        mutate: { errorPolicy: 'all' },
      },
    });
  }, [session]);

  return (
    <ApolloProvider client={apollo}>
      {children}
    </ApolloProvider>
  );
};
