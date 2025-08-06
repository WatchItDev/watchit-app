import { Box, Typography, Stack, Tooltip, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { m } from 'framer-motion';
import { varFade } from '@src/components/animate';
import AvatarProfile from '@src/components/avatar/avatar';
import { resolveSrc } from '@src/utils/image';
import { useRouter } from '@src/routes/hooks';
import { paths } from '@src/routes/paths';
import { useGetTipsByBakerForPostQuery } from '@src/graphql/generated/hooks';

interface Props { postId: string }
const SIZE = {
  hero: 72,
  heroMd: 64,
  norm: 56,
  normMd: 48,
};

export function PublicationSponsorsAndBackers({ postId }: Props) {
  const router = useRouter();
  const variants = varFade().inRight;

  const { data, loading } = useGetTipsByBakerForPostQuery({
    variables: { postId, limit: 40 },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const backers = data?.getTipsByBakerForPost ?? [];

  const totalBackers = backers.length;
  const totalMMC = backers.reduce((a, b) => a + (b?.totalAmount ?? 0), 0);

  const goTo = (address: string) => {
    if (!address) return;
    router.push(paths.dashboard.user.root(address));
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
        <m.div variants={variants}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }} gutterBottom>
            Sponsors
          </Typography>
        </m.div>
        <Box sx={{ mt: 2, opacity: 0.8 }}>
          <m.div variants={variants}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              No sponsors yet. Be the first to join and support!
            </Typography>
          </m.div>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
        <m.div variants={variants}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
              Backers
            </Typography>
            {!loading && totalBackers > 0 && (
              <Typography variant="body2" color="text.secondary">
                {totalBackers} · {Math.floor(totalMMC)} MMC
              </Typography>
            )}
          </Stack>
        </m.div>

        {loading && (
          <Stack direction="row" spacing={1.5} sx={{ mt: 1, overflowX: 'auto', pb: 1 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="circular" width={56} height={56} />
            ))}
          </Stack>
        )}

        {!loading && backers.length === 0 && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            No backers yet. Be the first to join and support!
          </Typography>
        )}

        {!loading && backers.length > 0 && (
          <Stack
            direction="row"
            spacing={1.1}
            sx={{
              mt: 1.25,
              flexWrap: { xs: 'nowrap', md: 'wrap' },
              overflowX: { xs: 'auto', md: 'visible' },
              pb: { xs: 1, md: 0 },
            }}
          >
            {backers.map((b) => {
              const name = b.baker.displayName || b.baker.username || b.baker.address;
              const avatarSrc = resolveSrc(b.baker.profilePicture || b.baker.address, 'profile');
              return (
                <Tooltip
                  key={b.baker.address}
                  title={
                    <Box>
                      <Typography variant="subtitle2">{name}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {Math.floor(b.totalAmount)} MMC · {b.count} {b.count === 1 ? 'tip' : 'tips'}
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <BackerItem onClick={() => goTo(b.baker.address)} role="button" tabIndex={0}
                              onKeyDown={(e) => (e.key === 'Enter' ? goTo(b.baker.address) : null)}>
                    <AvatarProfile
                      src={avatarSrc}
                      variant="rounded"
                      sx={{
                        width: { xs: SIZE.normMd, md: SIZE.norm },
                        height: { xs: SIZE.normMd, md: SIZE.norm },
                        border: 'solid 2px #161C24',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.40)',
                      }}
                    />
                    <AmountPill>
                      {Math.floor(b.totalAmount)}
                    </AmountPill>
                  </BackerItem>
                </Tooltip>
              );
            })}
          </Stack>
        )}
      </Box>
    </>
  );
}

const BackerItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  transform: 'scale(0.9)',
  transition: theme.transitions.create(['transform', 'opacity'], { duration: 160 }),
  '&:hover': {
    transform: 'translateY(-3px)',
    opacity: 0.96,
  },
  outline: 'none',
}));

const AmountPill = styled('div')<{ big?: boolean }>(({ theme, big }) => ({
  position: 'absolute',
  bottom: -8,
  right: -8,
  padding: big ? '4px 10px' : '3px 8px',
  fontSize: big ? 12 : 11,
  fontWeight: 800,
  borderRadius: 999,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, #6b9c07)`,
  boxShadow: '0 8px 18px rgba(0,0,0,0.35)',
  whiteSpace: 'nowrap',
}));
