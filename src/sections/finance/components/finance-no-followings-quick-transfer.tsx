import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * FinanceNoFollowingsQuickTransfer is a React functional component that serves as a user interface element
 * to guide users when there are no followings available for quick transfers.
 *
 * Features:
 * - Displays a message prompting the user to follow someone in order to make transfers.
 * - Includes a visual divider with an "OR" indicator for alternate actions.
 * - Provides instructions to perform a search to initiate a transfer.
 *
 * Styling:
 * - The component utilizes a centrally aligned design with spacing between elements.
 * - A dashed line and a circular indicator are used as visual cues.
 * - Background color and opacity settings enhance readability and focus.
 */
const FinanceNoFollowingsQuickTransfer = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mb: 3,
        backgroundColor: 'rgba(0,0,0,0.1)',
        p: 1,
        borderRadius: 1,
      }}
    >
      <Stack direction="column" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.primary">
          Here appear your followings. Follow one to transfer.
        </Typography>
        <Box
          sx={{
            opacity: 0.7,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            my: 2,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              transform: 'translateX(-50%)',
              width: 200,
              height: 25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px dashed',
              borderColor: 'text.secondary',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgb(44,46,51)',
              borderRadius: '50%',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: 'text.secondary',
            }}
          >
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              OR
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.primary">
          Perform a search to start a transfer.
        </Typography>
      </Stack>
    </Box>
  );
};

export default FinanceNoFollowingsQuickTransfer;
