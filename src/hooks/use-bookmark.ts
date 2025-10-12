export function useBookmarks() {
  return {
    loading: false,
    has: () => false,
    data: [],
    refetch: async () => undefined,
  };
}
