import { FC, useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import { SxProps, Theme } from '@mui/material/styles';
import Iconify from '@src/components/iconify';
import { notifyError, notifySuccess } from '@src/libs/notifications/internal-notifications.ts';
import { SUCCESS } from '@src/libs/notifications/success.ts';
import { ERRORS } from '@src/libs/notifications/errors';

// ----------------------------------------------------------------------

interface BaseLink {
  icon: string;
  label: string;
  url: string;
}

interface ExtraIcon {
  key: string;
  icon: string;
}

interface ShareButtonProps {
  placeholder: string;
  pathPrefix: string;
  targetId: string;
  shareLinks: BaseLink[];
  socialMediaList?: ExtraIcon[];
  socialMediaUrls?: Record<string, string | undefined>;
  templateUrl: string;
  buttonVariant?: 'text' | 'outlined';
  buttonSx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

const ShareButton: FC<ShareButtonProps> = ({
                                             placeholder,
                                             pathPrefix,
                                             targetId,
                                             shareLinks,
                                             templateUrl,
                                             socialMediaList,
                                             socialMediaUrls,
                                             buttonVariant = 'outlined',
                                             buttonSx,
                                           }) => {
  const [openTooltipShare, setOpenTooltipShare] = useState(false);
  const navRefSocial = useRef<HTMLButtonElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openPopover = Boolean(anchorEl);

  const replacePlaceholder = (url: string) =>
    url.replace(placeholder, `${pathPrefix}${targetId}`);

  const pageUrl = templateUrl.replace(placeholder, `${pathPrefix}${targetId}`);

  const handlePopoverOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handlePopoverClose = () => setAnchorEl(null);

  const handleOpenShare = useCallback(() => setOpenTooltipShare(true), []);
  const handleCloseShare = useCallback(() => setOpenTooltipShare(false), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      notifySuccess(SUCCESS.LINK_COPIED_TO_CLIPBOARD);
    } catch {
      notifyError(ERRORS.LINK_COPIED_ERROR);
    }
  };

  useEffect(() => {
    if (openPopover) handleCloseShare();
  }, [openPopover, handleCloseShare]);

  return (
    <>
      {socialMediaList?.map(
        ({ key, icon }) =>
          socialMediaUrls?.[key] && (
            <Button
              key={`link-${key}`}
              component="a"
              href={socialMediaUrls[key]!}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                border: '1px solid rgba(255,255,255,0.12)',
                p: 1,
                width: 40,
                height: 40,
                minWidth: 40,
              }}
            >
              <Iconify icon={icon} width={20} />
            </Button>
          ),
      )}

      <Button
        ref={navRefSocial}
        onMouseEnter={handleOpenShare}
        onMouseLeave={handleCloseShare}
        onClick={handlePopoverOpen}
        size="medium"
        variant={buttonVariant}
        sx={{ p: 1, minWidth: 44, ...buttonSx }}
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
              p: '8px 20px',
              ...(openPopover && { pointerEvents: 'auto' }),
            },
          },
        }}
        sx={{ pointerEvents: 'none' }}
      >
        <Typography>Share</Typography>
      </Popover>

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            background: 'linear-gradient(90deg,#1C1C1E,#2C2C2E)',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mt: 1.5,
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          },
        }}
      >
        <Typography variant="body1" fontWeight="bold" align="center" gutterBottom>
          Share link to this page
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          {shareLinks.map((item) => (
            <Stack key={item.label} direction="column" alignItems="center">
              <Button
                component="a"
                href={replacePlaceholder(item.url)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  border: '1px solid rgba(255,255,255,0.12)',
                  p: 1,
                  mb: 2,
                  width: 40,
                  height: 40,
                  minWidth: 40,
                }}
              >
                <Iconify icon={item.icon} width={20} />
              </Button>
              <Typography variant="subtitle2" fontSize={10} color="text.secondary">
                {item.label}
              </Typography>
            </Stack>
          ))}

          <Stack direction="column" alignItems="center">
            <Button
              onClick={handleCopy}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                border: '1px solid rgba(255,255,255,0.12)',
                p: 1,
                mb: 2,
                width: 40,
                height: 40,
                minWidth: 40,
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

export default ShareButton;
