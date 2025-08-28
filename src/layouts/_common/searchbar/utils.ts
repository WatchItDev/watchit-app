import { ItemProps, NavItemProps } from './types';

// ----------------------------------------------------------------------

interface FilterProps {
  inputData: ItemProps[];
  query: string;
}

export function applyFilter({ inputData, query }: FilterProps) {
  if (query) {
    inputData = inputData.filter(
      (item) =>
        item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        item.path.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------
export function handleLoop(
  array: NavItemProps[] | undefined,
  subheader?: string,
): NavItemProps[] {
  return (
    array?.map((list) => ({
      subheader,
      ...list,
      ...(list.children && {
        children: handleLoop(list.children, subheader),
      }),
    })) || []
  );
}
