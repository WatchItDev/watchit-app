import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Iconify from '@src/components/iconify';
import { notifyError, notifySuccess } from '@src/libs/notifications/internal-notifications.ts';
import { SUCCESS } from '@src/libs/notifications/success.ts';
import { ERRORS } from '@src/libs/notifications/errors';
import { ProfileShareProps, SocialMediaUrls } from '../types';
import { shareLinks, socialMedia, urlToShare } from '../CONSTANTS'
import { getSocialLinks } from '@src/utils/profile.ts';

const ProfileShare: FC<ProfileShareProps> = ({ profile }) => {
  const [openTooltipShare, setOpenTooltipShare] = useState(false);
  const navRefSocial = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const socialMediaUrls = getSocialLinks(profile);

  const prependProfileIdToUrl = (url: string, profileId: string) => {
    return url.replace('profileId', 'profile/' + profileId);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenShare = useCallback(() => {
    setOpenTooltipShare(true);
  }, []);

  const handleCloseShare = useCallback(() => {
    setOpenTooltipShare(false);
  }, []);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        urlToShare.replace('profileId', 'profile/' + profile?.address)
      );
      notifySuccess(SUCCESS.LINK_COPIED_TO_CLIPBOARD);
    } catch (err) {
      console.log('Error', err);
      notifyError(ERRORS.LINK_COPIED_ERROR);
    }
  };

  const handleClose = useCallback(() => {
    setOpenTooltipShare(false);
  }, []);

  useEffect(() => {
    if (open) {
      handleClose();
    }
  }, [handleClose, open]);

  return (
    <>
        {socialMedia.map(
          ({ key, icon }) =>
            socialMediaUrls[key as keyof SocialMediaUrls] && (
              <Button
                key={`link-${key}`}
                component="a"
                href={socialMediaUrls[key as keyof SocialMediaUrls]}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  p: 1,
                  width: 40,
                  height: 40,
                  minWidth: '40px',
                }}
              >
                <Iconify icon={icon} width={20} />
              </Button>
            )
        )}
        <Button
          onMouseEnter={handleOpenShare}
          onMouseLeave={handleCloseShare}
          ref={navRefSocial}
          size="medium"
          variant="outlined"
          sx={{ p: 1, minWidth: '44px' }}
          onClick={handlePopoverOpen}
        >
          <Iconify icon="ion:share-social-outline" width={20} />
        </Button>

        <Popover
          open={openTooltipShare}
          anchorEl={navRefSocial.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          slotProps={{
            paper: {
              onMouseEnter: handleOpenShare,
              onMouseLeave: handleCloseShare,
              sx: {
                mt: 6,
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '8px 20px',
                ...(open && {
                  pointerEvents: 'auto',
                }),
              },
            },
          }}
          sx={{
            pointerEvents: 'none',
          }}
        >
          <Typography>Share</Typography>
        </Popover>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          PaperProps={{
            sx: {
              background: 'linear-gradient(90deg, #1C1C1E, #2C2C2E)',
              borderRadius: 2,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              mt: 1.5,
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <Typography variant="body1" fontWeight="bold" align="center" gutterBottom>
            Share link to this page
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            {shareLinks.map((item) => (
              <Stack
                key={`share-link-item-${item.label}`}
                direction="column"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  component="a"
                  href={prependProfileIdToUrl(item.url, profile?.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    p: 1,
                    mb: 2,
                    width: 40,
                    height: 40,
                    minWidth: '40px',
                  }}
                >
                  <Iconify icon={item.icon} width={20} />
                </Button>
                <Typography variant="subtitle2" fontSize={10} color="text.secondary">
                  {item.label}
                </Typography>
              </Stack>
            ))}
            <Stack direction="column" alignItems="center" justifyContent="center">
              <Button
                onClick={handleCopy}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  p: 1,
                  mb: 2,
                  width: 40,
                  height: 40,
                  minWidth: '40px',
                }}
              >
                <Iconify icon="mdi:link-variant" width={20} />
              </Button>
              <Typography variant="subtitle2" fontSize={10} color="text.secondary">
                Copy
              </Typography>
            </Stack>
          </Stack>
        </Popover>
    </>
  );
};

export default ProfileShare;
