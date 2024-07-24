import { Helmet } from 'react-helmet-async';
// sections
import SliderView from 'src/sections/_examples/mui/slider-view';

// ----------------------------------------------------------------------

export default function SliderPage() {
  return (
    <>
      <Helmet>
        <title> MUI: Slider</title>
      </Helmet>

      <SliderView />
    </>
  );
}
