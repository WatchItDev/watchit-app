// ----------------------------------------------------------------------

interface TreeNode<T> {
  [key: string]: unknown;
  children?: T[];
}

export function flattenArray<T extends TreeNode<T>>(list: T[], key = 'children'): T[] {
  let children: T[] = [];

  const flatten = list?.map((item: T) => {
    if (item[key] && Array.isArray(item[key]) && item[key].length) {
      children = [...children, ...item[key] as T[]];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}
