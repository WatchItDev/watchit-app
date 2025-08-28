import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema:    'http://127.0.0.1:4000/graphql',
  documents: 'src/graphql/**/*.gql',
  generates: {
    './src/graphql/generated/': {
      preset: 'client'
    },
    'src/graphql/generated/hooks.tsx': {
      plugins: ['typescript-react-apollo'],
      config: {
        withHooks: true,
        withLazyQuery:  false,
        reactApolloVersion: 4,
        apolloReactHooksImportFrom: "@apollo/client/react",
        scalars: { Timestamp: 'number' },
      },
    },
  },
  overwrite: true,
};

export default config;
