// REACT IMPORTS
import { useEffect, useRef, useState } from 'react';

// MUI IMPORTS
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// LENS IMPORTS
import { usePublication } from '@lens-protocol/react';

// MOTION IMPORTS
import { m } from 'framer-motion';

// ICONS IMPORTS
import { IconPlayerPlay } from '@tabler/icons-react';

// LOCAL IMPORTS
import Image from '@src/components/image';
import Markdown from '@src/components/markdown';
import { varFade } from '@src/components/animate';
import ProfileHome from '@src/sections/user/profile-home.tsx';
import { LoadingScreen } from '@src/components/loading-screen';
import MoviePlayView from '@src/sections/publication/view/publication-play-view.tsx';
import PublicationDetailMain from '@src/components/publication-detail-main.tsx';
import { useHasAccess } from '@src/hooks/use-has-access.ts';
import { SubscribeProfileModal } from '@src/components/subscribe-profile-modal.tsx';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@redux/auth';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import {
  appId,
  ProfileSession,
  PublicationType,
  usePublications,
  useSession,
} from '@lens-protocol/react-web';

const MAX_LINES = 5;

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

// ----------------------------------------------------------------------

export default function PublicationDetailsView({ id }: Props) {
  // STATES HOOKS
  const [showToggle, setShowToggle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [openSubscribeModal, setOpenSubscribeModal] = useState(false);
  const descriptionRef: any = useRef(null);
  // REDUX HOOKS
  const dispatch = useDispatch();
  // LOCAL HOOKS
  const theme = useTheme();
  // LENS HOOKS
  const { data: sessionData }: ReadResult<ProfileSession> = useSession();
  const { data, loading }: any = usePublication({ forId: id as any });
  // CONSTANTS
  const variants = theme.direction === 'rtl' ? varFade().inLeft : varFade().inRight;
  const ownerAddress = data?.by?.ownedBy?.address;

  // PROTOCOL HOOKS
  const {
    hasAccess,
    loading: accessLoading,
    fetching: accessFetchingLoading,
    refetch: refetchAccess,
  } = useHasAccess(ownerAddress);

  // const getMediaUri = (cid: string): string => `https://ipfs.io/ipfs/${cid?.replace('ipfs://', '')}`
  const getMediaUri = (cid: string): string => `${cid}`;

  const getWallpaperCid = (): string =>
    data?.metadata?.attachments?.find((el: any) => el?.altTag === 'wallpaper')?.image?.raw?.uri;

  const getPosterCid = (): string =>
    data?.metadata?.attachments?.find((el: any) => el?.altTag === 'poster')?.image?.raw?.uri;

  const toggleDescription = () => {
    setShowToggle(!showToggle);
  };

  const handleSubscribe = () => {
    if (!sessionData?.authenticated) return dispatch(openLoginModal());

    setOpenSubscribeModal(true);
  };

  // Function to handle following a profile
  const onSubscribe = async () => {
    refetchAccess();
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight, 10);
      const maxHeight = lineHeight * MAX_LINES;
      if (descriptionRef.current.scrollHeight > maxHeight) {
        setShowButton(true);
      }
    }
  }, [descriptionRef.current, data?.metadata?.content]);

  // Load publications from current user to show in More from section
  const { data: publications } = usePublications({
    where: {
      from: [data?.by?.id],
      publicationTypes: [PublicationType.Post],
      metadata: { publishedOn: [appId('watchit')] },
    },
  });

  // Remove from publications the current publication
  const filteredPublications = publications?.filter((publication) => publication.id !== id) ?? [];

  if (loading || accessLoading) return <LoadingScreen />;

  return (
    <>
      <Box
        sx={{
          flexDirection: {
            xs: 'column',
            lg: 'row',
          },
          display: 'flex',
          width: '100%',
          maxHeight: '100%',
          position: 'relative',
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexGrow: 1,
          }}
        >
          <Card sx={{ width: '100%' }}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {hasAccess ? (
                <MoviePlayView publication={data} loading={loading} />
              ) : (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: '100%',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '15px',
                      backdropFilter: 'blur(8px)',
                      background: 'rgba(25, 28, 31, 0.5)',
                    }}
                  />

                  <Image
                    dir="ltr"
                    alt={data?.metadata?.title}
                    src={getMediaUri(getWallpaperCid())}
                    ratio="21/9"
                    sx={{
                      borderRadius: 2,
                      zIndex: 0,
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  />

                  <Image
                    alt={data?.id}
                    src={getMediaUri(getPosterCid())}
                    ratio="1/1"
                    sx={{
                      borderRadius: 1,
                      objectFit: 'cover',
                      maxWidth: '30%',
                      position: 'absolute',
                      zIndex: 2,
                      border: '2px solid rgba(255, 255, 255, 0.08)',
                    }}
                  />

                  <LoadingButton
                    variant="contained"
                    sx={{
                      color: '#1E1F22',
                      background: '#FFFFFF',
                      height: '35px',
                      bottom: 16,
                      left: 16,
                      position: 'absolute',
                      zIndex: 2,
                    }}
                    onClick={handleSubscribe}
                    disabled={accessLoading || hasAccess || accessFetchingLoading}
                    loading={accessLoading || accessFetchingLoading}
                  >
                    <IconPlayerPlay fontSize="large" size={18} />
                    <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: '700', ml: 1 }}>
                      Join
                    </Typography>
                  </LoadingButton>
                </Box>
              )}

              <Container sx={{ mb: 8, p: '0 !important' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mt: 3 }}
                  >
                    <m.div variants={variants}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
                        gutterBottom
                      >
                        {data?.metadata?.title}
                      </Typography>
                    </m.div>
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <m.div variants={variants}>
                        <Box
                          ref={descriptionRef}
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: showToggle ? 'none' : MAX_LINES,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            opacity: 0.8,
                          }}
                        >
                          <Markdown children={data?.metadata?.content} />
                        </Box>
                        {showButton && (
                          <Button variant="outlined" onClick={toggleDescription} sx={{ mt: 2 }}>
                            {showToggle ? 'Show less' : 'Show more'}
                          </Button>
                        )}
                      </m.div>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mt: 4 }}
                  >
                    <m.div variants={variants}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
                        gutterBottom
                      >
                        Sponsors
                      </Typography>
                    </m.div>
                    <Box sx={{ mt: 2, opacity: 0.8 }}>
                      <m.div variants={variants}>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
                          gutterBottom
                        >
                          No Sponsors yet. Be the first to support!
                        </Typography>
                      </m.div>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mt: 4 }}
                  >
                    <m.div variants={variants}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
                        gutterBottom
                      >
                        Bakers
                      </Typography>
                    </m.div>
                    <Box sx={{ mt: 2, opacity: 0.8 }}>
                      <m.div variants={variants}>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
                          gutterBottom
                        >
                          No Bakers yet. Be the first to support!
                        </Typography>
                      </m.div>
                    </Box>
                  </Box>

                  {filteredPublications?.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6 }}>
                      <Typography variant="h5" sx={{ mb: 2, width: '100%' }}>
                        More from {data?.by?.metadata?.displayName.split(' ')[0]}
                      </Typography>
                      <ProfileHome publications={[...filteredPublications]} noPaddings={true} />
                    </Box>
                  )}
                </Box>
              </Container>
            </CardContent>
          </Card>
        </Stack>

        <PublicationDetailMain
          post={data}
          handleSubscribe={handleSubscribe}
          loadingSubscribe={accessLoading || accessFetchingLoading}
          subscribeDisabled={accessLoading || hasAccess || accessFetchingLoading}
          hasAccess={!!hasAccess}
        />
      </Box>
      <SubscribeProfileModal
        isOpen={openSubscribeModal}
        onClose={() => setOpenSubscribeModal(false)}
        onSubscribe={onSubscribe}
        profile={data?.by}
      />
    </>
  );
}
