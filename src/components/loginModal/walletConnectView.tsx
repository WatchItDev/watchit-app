// REACT IMPORTS
import React, { useEffect } from 'react';

// MUI IMPORTS
import {
  Typography,
  List,
  ListItem,
  Button,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material';

// HOOKS IMPORTS
import { useConnect } from 'wagmi';

// ICONS IMPORTS
import { coinbaseIcon } from 'src/assets/icons/coinbase-icon_base64';

// ----------------------------------------------------------------------

export interface WalletConnectProps {
  onConnect: (args: { connector: any, icon: any }) => void,
  onConnectorsLoad: () => void
}

// ----------------------------------------------------------------------

export const WalletConnectView: React.FC<WalletConnectProps> = ({ onConnect, onConnectorsLoad }) => {
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (connectors) onConnectorsLoad?.()
  }, [connectors, onConnectorsLoad]);

  const handleConnect = async (connector: any, icon: any) => {
    await connect({ connector });
    onConnect?.({ connector, icon })
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Connect a Wallet
      </Typography>

      <List>
        {connectors.map((connector) => (
          <ListItem key={connector.id} sx={{ width: '100%' }}>
            <Button onClick={() => handleConnect(connector, connector.icon ?? coinbaseIcon)}
                    sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <ListItemAvatar>
                <Avatar src={connector.icon ?? coinbaseIcon} />
              </ListItemAvatar>
              <ListItemText primary={connector.name} sx={{ width: 'auto', display: 'flex' }} />
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};
