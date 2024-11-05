// @mui
import Typography from '@mui/material/Typography';
// routes
import { paths } from '@src/routes/paths';
//
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePublication } from '@lens-protocol/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';
import Button from '@mui/material/Button';
import { useResponsive } from '../../../hooks/use-responsive';
import { useRouter } from '../../../routes/hooks';
import { LoadingScreen } from '../../../components/loading-screen';
import Label from '../../../components/label';
import VideoPlayer from '../../../components/VideoPlayer';

// ----------------------------------------------------------------------

type Props = {
  id: string | undefined;
};

// ----------------------------------------------------------------------

export default function MoviePlayView({ id }: Props) {
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();
  const { data, error, loading }: any = usePublication({
    forId: id as any
  });

  const handleBack = () => {
    router.push(paths.dashboard.movie.details(`${id}`));
  }

  const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid?.replace('ipfs://', '')}`

  const getMovieCid = (): string => data?.metadata?.attachments?.find((el: any) => el.altTag === 'Full Movie')?.video?.raw?.uri

  if (loading) return <LoadingScreen />

  return (
    <>
      {
        getMovieCid() && (
          <VideoPlayer
            src={getMediaUri(getMovieCid())}
            titleMovie={data?.metadata?.title}
            preview={false}
            onBack={handleBack}
          />
        )
      }
    </>
  );
}
