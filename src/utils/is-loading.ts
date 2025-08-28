export const isLoading = (section: Record<string, boolean>) => {
  return Object.values(section).some((value) => value);
};
