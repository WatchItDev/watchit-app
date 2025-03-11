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
