import { dicebear, picsum } from '@src/utils/dicebear.ts';


const resolvers: [RegExp, (src: string) => string][] = [
  [/^ipfs:\/\//, (src) => src.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/')],
  [/^(https?:)/, (src) => src],
  [/^blob:/, (src) => src],
];

export const resolveSrc = (src: string, type: 'cover' | 'profile' = 'profile'): string => {
  const entry = resolvers.find(([pattern]) => pattern.test(src));
  return entry ? entry[1](src) : type === 'profile' ? dicebear(src) : picsum(src);
};

export const resolveWatchitImage = (cid: string): string => {
  return `https://g.watchit.movie/content/${cid}/`;
};
