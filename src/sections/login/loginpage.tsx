import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoLarge from 'src/components/logoLarge';



import { useCountdownDate } from 'src/hooks/use-countdown';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from '@wagmi/connectors/injected';
import { LensClient, development, isRelaySuccess } from "@lens-protocol/client";
import { Profile, useLogin, useProfilesManaged } from '@lens-protocol/react-web';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { LoginOptions } from './LoginOptions';



export default function LoginPage() {
  const { days, hours, minutes, seconds } = useCountdownDate(new Date('09/01/2024 21:30'));
  const { address, isConnecting, isDisconnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { execute } = useLogin();
  const navigate = useNavigate();

  const [loginClicked, setLoginClicked] = useState(false);

  const goToHome = (profile: Profile) => {
    navigate('/');
    console.log('Logged in as', profile.handle?.fullHandle ?? profile.id);
  };

  if (isDisconnected && address === undefined) {
    return (
      <Box>
      <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
        }}>

      <LogoLarge />
      </Box>
      <Box sx={{
           marginLeft: '29vw'
        }}>
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => connect({ connector })}
          >
            {connector.name}
          </Button>
        ))}
        </Box>

      </Box>
    );
  }

  return (
    <Box>
      {/* Conditionally render LoginOptions only if address is defined */}
      {address && <LoginOptions wallet={address} onSuccess={goToHome} />}
    </Box>
  );
}
