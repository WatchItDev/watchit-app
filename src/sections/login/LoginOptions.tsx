import { useState } from 'react';
import { useProfilesManaged, Profile } from '@lens-protocol/react-web';
import { Card, CardContent, CardActionArea, Typography, CircularProgress, Box, Button } from '@mui/material';
import { LensClient, development, isRelaySuccess } from "@lens-protocol/client";

import { LoginAs } from './LoginAs';
import { RegisterModal } from './RegisterModal';  // Import the modal component

type LoginOptionsProps = {
  wallet: string;
  onSuccess: (profile: Profile) => void;
};

export function LoginOptions({ wallet, onSuccess }: LoginOptionsProps) {
  const { data: profiles, error, loading } = useProfilesManaged({
    for: wallet,
    includeOwned: true,
  });

  const [modalOpen, setModalOpen] = useState(false);

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (error) {
    console.log(error, "error");
    return <p>Error</p>;
  }

  if (profiles.length === 0 ) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create profile for this wallet.
        </Typography>

        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          Register Now
        </Button>
        <RegisterModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={async (username) => {
            // Add your custom logic for account creation here
            console.log('Register with username:', username);
            const client = new LensClient({  environment: development, // wont't work with `production`

            });
            const result = await client.wallet.createProfileWithHandle({  // e.g. 'alice' which will be '@lens/alice' in full-handle notation
            handle: username,  to: wallet,});
            console.log(result)
            if (!isRelaySuccess(result)) {  console.error(`Something went wrong`, result); }
              window.location.reload();
          }}
        />
      </Box>
    );
  }

  return (
    <div>
    <Typography variant="h2" component="div" gutterBottom>
      Choose your profile
    </Typography>
      {profiles.map((profile) => (
        <LoginAs profile={profile} wallet={wallet} onSuccess={onSuccess} />
      ))}
    </div>
  );
}
