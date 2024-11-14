// routes
import { paths } from '@src/routes/paths';
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePublication } from '@lens-protocol/react';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { useRouter } from '@src/routes/hooks';
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

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid?.replace('ipfs://', '')}`

  const getMovieCid = (): string => publication?.metadata?.attachments?.find((el: any) => el.altTag === 'Full Movie')?.video?.raw?.uri

  if (loading) return <LoadingScreen />

  return (
    <Box sx={{ width: '100%', borderRadius: '1rem', overflow: 'hidden', display: 'flex', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      {
        getMovieCid() && (
          <VideoPlayer
            src={getMediaUri(getMovieCid())}
            titleMovie={publication?.metadata?.title}
            preview={false}
            // onBack={handleBack}
          />
        )
      }
    </Box>
  );
}
