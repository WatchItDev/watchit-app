import Stack from '@mui/material/Stack';

// components
import { appId, PublicationType, usePublications } from '@lens-protocol/react-web';
import { CarouselSection } from '../../components/carousel/carousel-section';
import CarouselPoster from '../../components/carousel/variants/carousel-poster';
import { LoadingScreen } from '../../components/loading-screen';
import { getAccessiblePublications } from '../../utils/publication';

// ----------------------------------------------------------------------
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Props = {
  description: string;
};

export default function PublicationDetailsDescription() {
  const { data, loading }: any = usePublications({
    where: {
      publicationTypes: [PublicationType.Post],
      metadata: {
        // mainContentFocus: [PublicationMetadataMainFocusType.Video],
        publishedOn: [appId('watchit')],
      },
    },
  });

  if (loading) return <LoadingScreen />;

  const movieArr: any = getAccessiblePublications([
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
  ]);

  return (
    <Stack spacing={3} sx={{ pb: 6, maxWidth: '100%' }}>
      <CarouselSection title="Similar movies for you">
        <CarouselPoster data={movieArr} />
      </CarouselSection>

      <CarouselSection title="Your friends also watched">
        <CarouselPoster data={movieArr} />
      </CarouselSection>
    </Stack>
  );
}