export const dicebear = (seed: string) => {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`;
};

export const picsum = (seed: string) => {
  return `https://picsum.photos/seed/${seed}/1920/820`;
};
