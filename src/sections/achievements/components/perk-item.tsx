import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import CheckDark from '@src/assets/illustrations/check_dark.png';
import CheckGreen from '@src/assets/illustrations/check_green.png';

interface PerksItemProps {
  id: string;
  value: number;
  label: string;
  canClaim: boolean;
  isThisLoading: boolean;
  handleClaim: (id: string) => void;
  rewardPreview: string;
}

const PerksItem: FC<PerksItemProps> = (props) => {
  const {
    id,
    value,
    label,
    canClaim,
    isThisLoading,
    handleClaim,
    rewardPreview,
  } = props;

  return (
    <Box
      key={id}
      display="flex"
      alignItems="center"
      gap={1.5}
      mb={1.5}
    >
      <SmallIcon
        src={value === 100 ? CheckGreen : CheckDark}
        alt=""
        sx={{ width: 24, height: 24 }}
      />

      <Typography
        variant="body2"
        sx={{ flexShrink: 0, minWidth: 180 }}
      >
        {label}
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <ProgressBar variant="determinate" value={value} />
      </Box>

      {canClaim ? (
        <Button
          size="small"
          variant="contained"
          disabled={isThisLoading}
          onClick={() => handleClaim(id)}
          startIcon={
            isThisLoading ? <CircularProgress size={14} color="inherit" /> : null
          }
        >
          {isThisLoading ? 'Claiming…' : `Claim ${rewardPreview}`}
        </Button>
      ) : (
        <Typography
          variant="caption"
          sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}
        >
          {rewardPreview}
        </Typography>
      )}
    </Box>
  );
};

export default PerksItem;

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  backgroundColor: theme.palette.grey[800],
  '& .MuiLinearProgress-bar': {
    borderRadius: 3,
    backgroundColor: theme.palette.common.white,
  },
}));

const SmallIcon = styled('img')({
  width: 18,
  height: 18,
  objectFit: 'contain',
});
