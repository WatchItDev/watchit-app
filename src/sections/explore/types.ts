export interface TrendingTopicsType {
  id: number;
  image: string;
  title: string;
  desc: string;
}

export interface ExplorePublicationsSkeletonProps {
  title?: string
}

export interface ExploreCarouselSkeletonProps {
  title?: string
  SkeletonItemComponent?: React.ComponentType;
}
