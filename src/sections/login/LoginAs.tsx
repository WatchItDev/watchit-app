import React from 'react';
import { Profile, useLogin } from '@lens-protocol/react-web';
import { Card, CardContent, CardActionArea, Typography, CircularProgress, Box } from '@mui/material';

export type LoginAsProps = {
  profile: Profile;
  wallet: string;
  onSuccess: (profile: Profile) => void;
};

export function LoginAs({ profile, wallet, onSuccess }: LoginAsProps) {
  const { execute, loading } = useLogin();

  const login = async () => {
    const result = await execute({
      address: wallet,
      profileId: profile.id,
    });

    if (result.isSuccess()) {
      onSuccess(profile);
    } else {
      window.alert(result.error.message);
    }

    return undefined; // Ensures a value is returned
  };

  return (
    <div style={{ marginBottom: '16px' }}> {/* Add spacing between cards */}
      <Card>
        <CardActionArea onClick={login} disabled={loading}>
          <CardContent>
            <Box display="flex" alignItems="center" sx={{ gap: 2 }}> {/* Add spacing between items */}
              <Typography variant="h5" component="div">
                {profile.handle?.fullHandle ?? profile.id}
              </Typography>
              {loading && <CircularProgress size={24} />}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
