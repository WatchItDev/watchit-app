import { Helmet } from 'react-helmet-async';
// sections
import CarouselView from 'src/sections/_examples/extra/carousel-view';

// ----------------------------------------------------------------------

export default function CarouselPage() {
  return (
    <>
      <Helmet>
        <title> Extra: Carousel</title>
      </Helmet>

      <CarouselView />
    </>
  );
}
