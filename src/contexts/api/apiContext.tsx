import { createContext, useContext } from 'react';
import type { ApolloClient } from '@apollo/client';

export interface ApiContextValue {
  apollo: ApolloClient<any>;
}

export const ApiContext = createContext<ApiContextValue>({} as ApiContextValue);

export const useApi = () => useContext(ApiContext);
