import { Box, Button, Card, CardContent, Typography, Stack } from '@mui/material';
import { IconLock, IconPlayerPlay } from '@tabler/icons-react';

export const SubscribeToUnlockCard = ({onSubscribe }: { onSubscribe: () => void }) => {

  return (
    <Card sx={{ maxWidth: {
      xs: '100%',
        lg: 500
      }, margin: 'auto', backgroundColor: '#2B2D31', color: 'white', borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconLock fontSize="large" size={20} />
          <Typography variant="h6" fontWeight="bold">
            Join to view
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mb: 3 }}>
          This content is only available to our subscribers. Join our growing community and gain access to exclusive posts, behind-the-scenes content, and more!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: '100%', py: 1.5 }}
          onClick={onSubscribe}
        >
          <IconPlayerPlay size={20} style={{marginRight: 5}} />
          Subscribe to play
        </Button>
        <Box sx={{ mt: 3, borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Join now for only <strong>MMC 300/month</strong> and access to <strong>431</strong> exclusive posts from <strong>Jacob Peralta!</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
