// routes
import { paths } from '@src/routes/paths';
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePublication } from '@lens-protocol/react';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { useRouter } from '@src/routes/hooks';
import { LoadingScreen } from '../../../components/loading-screen';
import VideoPlayer from '../../../components/VideoPlayer';

// ----------------------------------------------------------------------
type Props = {
  id: string | undefined;
};

// ----------------------------------------------------------------------

export default function MoviePlayView({ id }: Props) {
  useResponsive('up', 'md');
  const router = useRouter();
  const { data, loading }: any = usePublication({
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
