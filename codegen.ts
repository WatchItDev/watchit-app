import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema:    'http://127.0.0.1:4000/graphql',
  documents: 'src/graphql/**/*.gql',
  generates: {
   'src/graphql/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        scalars: { Timestamp: 'number' },
      },
    },
    'src/graphql/generated/hooks.tsx': {
      plugins: ['typescript-react-apollo'],
      config: {
        withHooks: true,
        withLazyQuery:  true,
        importDocumentNodeExternallyFrom: './graphql',
        scalars: { Timestamp: 'number' },
      },
    },
  },
  overwrite: true,
};

export default config;
