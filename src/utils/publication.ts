// @ts-ignore
import {Post} from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated";

// ----------------------------------------------------------------------

export const getAccessiblePublications = (publications: Post[]): Post[] =>
  publications.filter((p) => !p?.isHidden);

// ----------------------------------------------------------------------
