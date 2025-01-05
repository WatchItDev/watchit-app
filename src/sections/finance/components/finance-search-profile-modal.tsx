import { useState, useCallback } from 'react';
import {
  Box,
  Dialog,
  ListItemButton,
  ListItemText,
  Avatar,
  CircularProgress,
  IconButton,
} from '@mui/material';
import Iconify from '@src/components/iconify';
import { Profile } from '@lens-protocol/api-bindings';
import { useSearchProfiles } from '@lens-protocol/react-web';
import Typography from '@mui/material/Typography';
import Label from '@src/components/label';
import { dialogClasses } from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import Scrollbar from '@src/components/scrollbar/scrollbar.tsx';
import SearchNotFound from '@src/components/search-not-found';
import { useTheme } from '@mui/material/styles';
import { useBoolean } from '@src/hooks/use-boolean.ts';

interface FinanceSearchProfileModalProps {
  onSelectProfile: (profile: Profile) => void;
}

export default function FinanceSearchProfileModal({
                                                    onSelectProfile,
                                                  }: FinanceSearchProfileModalProps) {
  const open = useBoolean();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const { data: profiles, loading } = useSearchProfiles({
    query: searchQuery,
  });

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const handleClose = () => {
    open.onFalse();
    setSearchQuery('')
  };

  const handleSelectProfile = (profile: Profile) => {
    onSelectProfile(profile);
    handleClose();
  };

  const renderItems = () => {
    if (!searchQuery && !profiles?.length) {
      return (
        <Typography
          variant="h6"
          sx={{
            py: 10,
            textAlign: 'center',
            color: 'text.secondary',
            height: 340,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          You can search for profiles to transfer here.
        </Typography>
      );
    }

    return (
      <>
        {profiles &&
          profiles.map((profile: Profile) => {
            const avatarSrc =
              (profile?.metadata?.picture as any)?.optimized?.uri ??
              `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${profile.id}`;

            return (
              <ListItemButton
                key={profile.id}
                onClick={() => handleSelectProfile(profile)}
              >
                <Avatar
                  src={avatarSrc}
                  alt={profile.metadata?.displayName ?? ''}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <ListItemText
                  primary={
                    profile.metadata?.displayName ||
                    profile.handle?.localName ||
                    'No Name'
                  }
                  secondary={profile.id}
                />
              </ListItemButton>
            );
          })}
      </>
    );
  };

  const renderButton = (
    <IconButton component={'div'} onClick={open.onTrue}>
      <Iconify icon="eva:search-fill" />
    </IconButton>
  );

  const notFound = searchQuery && !profiles?.length;

  return (
    <>
      {renderButton}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open.value}
        onClose={handleClose}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{ sx: { mt: 15, overflow: 'unset' } }}
        sx={{ [`& .${dialogClasses.container}`]: { alignItems: 'flex-start' } }}
      >
        <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
          <InputBase
            fullWidth
            autoFocus
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={24} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            endAdornment={<Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>esc</Label>}
            inputProps={{ sx: { typography: 'h6' } }}
          />
        </Box>
        <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>
          {loading && (
            <Box
              sx={{
                width: '100%',
                height: '340px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={32} sx={{ color: '#fff' }} />
            </Box>
          )}
          {notFound && !loading && <SearchNotFound query={searchQuery} sx={{ py: 10 }} />}
          {!notFound && !loading && renderItems()}
        </Scrollbar>
      </Dialog>
    </>
  );
}
