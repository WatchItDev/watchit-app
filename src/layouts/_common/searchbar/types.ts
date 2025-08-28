export interface ResultProps {
  title: string;
  subtitle: string;
  groupLabel: string;
  onClickItem: VoidFunction;
  query?: string;
}

export interface SearchPublicationResult {
  id: string;
  title: string;
  description: string;
  post_id: string;
}

export interface ItemProps {
  group: string;
  title: string;
  path: string;
}

export interface NavItemProps {
  title: string;
  path: string;
  children?: NavItemProps[];
  [key: string]: unknown; // For other potential properties
}
