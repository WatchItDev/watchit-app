// eslint-disable-next-line import/no-extraneous-dependencies
import { LoadingScreen } from '../../../components/loading-screen';
import VideoPlayer from '../../../components/VideoPlayer';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------
type Props = {
  publication: any;
  loading: boolean;
};

// ----------------------------------------------------------------------

export default function PublicationPlayView({ publication, loading }: Props) {
  // useResponsive('up', 'md');
  // const router = useRouter();

  // const handleBack = () => {
  //   router.push(paths.dashboard.publication.details(`${id}`));
  // }

  // const getMediaUri = (cid: string): string => `https://g.watchit.movie/content/${cid?.replace('ipfs://', '')}/`
  const getMediaUri = (cid: string): string => `https://g.watchit.movie/content/${cid}/`;

  const getMovieCid = (): string => publication?.metadata?.asset?.video?.raw?.uri;

  if (loading) return <LoadingScreen />;

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {getMovieCid() && (
        <VideoPlayer
          src={getMediaUri(getMovieCid())}
          titleMovie={publication?.metadata?.title}
          // onBack={handleBack}
        />
      )}
    </Box>
  );
}
