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
import Typography from '@mui/material/Typography';
import Label from '@src/components/label';
import { dialogClasses } from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import Scrollbar from '@src/components/scrollbar/scrollbar.tsx';
import SearchNotFound from '@src/components/search-not-found';
import { useTheme } from '@mui/material/styles';
import { useBoolean } from '@src/hooks/use-boolean.ts';
import { User } from '@src/graphql/generated/graphql.ts';
import { resolveSrc } from '@src/utils/image.ts';
import { truncateAddress } from '@src/utils/wallet.ts';
import { useGetUsersLazyQuery } from '@src/graphql/generated/hooks.tsx';

interface FinanceSearchProfileModalProps {
  onSelectProfile: (profile: User) => void;
}

export default function FinanceSearchProfileModal({
  onSelectProfile,
}: FinanceSearchProfileModalProps) {
  const open = useBoolean();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const [searchUsers, { data, loading }] = useGetUsersLazyQuery();
  const profiles = data?.getUsers;

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchQuery(value);
      searchUsers({ variables: { query: value, limit: 50 } });
    },
    [],
  );

  const handleClose = () => {
    open.onFalse();
    setSearchQuery('');
    searchUsers({ variables: { query: '' } });
  };

  const handleSelectProfile = (profile: User) => {
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
          profiles.map((profile: User) => {
            const avatarSrc = resolveSrc(
              profile.profilePicture || profile.address,
              'profile',
            );

            return (
              <ListItemButton
                key={profile.address}
                onClick={() => handleSelectProfile(profile)}
              >
                <Avatar
                  src={avatarSrc}
                  alt={profile.displayName ?? ''}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <ListItemText
                  primary={profile.displayName || profile.username || 'No Name'}
                  secondary={truncateAddress(profile.address)}
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
                <Iconify
                  icon="eva:search-fill"
                  width={24}
                  sx={{ color: 'text.disabled' }}
                />
              </InputAdornment>
            }
            endAdornment={
              <Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>
                esc
              </Label>
            }
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
          {notFound && !loading && (
            <SearchNotFound query={searchQuery} sx={{ py: 10 }} />
          )}
          {!notFound && !loading && renderItems()}
        </Scrollbar>
      </Dialog>
    </>
  );
}
