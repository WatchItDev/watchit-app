// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// types
import { IProductReview } from 'src/types/product';
//
import MovieReviewItem from './movie-review-item';

// ----------------------------------------------------------------------

type Props = {
  reviews: IProductReview[];
};

export default function MovieReviewList({ reviews }: Props) {
  return (
    <>
      {reviews.map((review) => (
        <MovieReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={10}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}
