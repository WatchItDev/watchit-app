import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';

import CheckDark from '@src/assets/illustrations/check_dark.png';
import CheckGreen from '@src/assets/illustrations/check_green.png';

const challenges = [
  { label: 'Like a comment', value: 100, reward: '+1 XP' },
  { label: 'Watch 5 videos', value: 60, reward: '+5 XP' },
  { label: 'Watch a full video', value: 0, reward: '+10 XP' },
  { label: 'Complete interactive guide', value: 0, reward: '+20 XP' },
  { label: 'Complete your profile', value: 0, reward: '+10 XP' },
  { label: 'Like 10 videos', value: 40, reward: '+15 XP' },
];

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 3,
  backgroundColor: theme.palette.grey[800],
  '& .MuiLinearProgress-bar': {
    borderRadius: 3,
    backgroundColor: theme.palette.common.white, // white bar
  },
}));

const SmallIcon = styled('img')({
  width: 18,
  height: 18,
  objectFit: 'contain',
});

const ChallengesList = () => {
  return (
    <Card>
      <CardHeader title="Challenges" sx={{ px: 0 }} />
      <CardContent sx={{ pt: 2, px: 0 }}>
        {challenges.map(({ label, value, reward }) => (
          <Box
            key={label}
            display="flex"
            alignItems="center"
            gap={1.5}
            mb={1.5}
          >
            <SmallIcon
              src={value === 100 ? CheckGreen : CheckDark}
              alt="check"
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

            <Typography
              variant="caption"
              sx={{ width: 48, textAlign: 'right' }}
            >
              {reward}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

export default ChallengesList;
