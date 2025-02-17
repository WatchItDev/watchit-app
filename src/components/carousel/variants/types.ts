import {Profile} from "@lens-protocol/api-bindings";
// @ts-ignore
import type {Post} from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated";


export type CarouselSlideProps = {
  items: Profile[];
  itemsPerRow: number;
};

export type CarouselCreatorsProps = {
  data: Profile[];
  title?: string;
  minItemWidth: number;
  maxItemWidth: number;
};

export type CarouselPosterMiniProps = {
  data: Post[];
  title?: string;
  minItemWidth: number;
  maxItemWidth: number;
};

export type CarouselTopTitlesProps = {
  posts: Post[];
  category?: string;
};

export type CarouselPosterSlideProps = {
  items: Post[];
  itemsPerRow: number;
};
