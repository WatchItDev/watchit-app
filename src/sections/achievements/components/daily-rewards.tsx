import { FC } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import GuessImg from '@src/assets/illustrations/guess.png';
import QuestionImg from '@src/assets/illustrations/question.png';
import WheelImg from '@src/assets/illustrations/wheel.png';
import MiniGameCard from '@src/sections/achievements/components/mini-game-card.tsx';

const DailyRewards: FC = () => {
  return (
    <Card sx={{ p: 0, mr: -1 }}>
      <CardHeader title="Daily rewards (Coming soon)" sx={{ pb: 0 }} />
      <CardContent sx={{ pl: 0, pr: 0, opacity: 0.5, display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <Box
          component="img"
          src={WheelImg}
          alt="Spin wheel"
          sx={{ width: 250, borderRadius: '50%' }}
        />

        <MiniGameCard
          title="Answer 5 questions"
          buttonLabel="Play"
          imageSrc={QuestionImg}
          sx={{ mt: 0 }}
        />

        <MiniGameCard
          title="Guess the movie"
          buttonLabel="Play"
          imageSrc={GuessImg}
          sx={{ mt: 2, pt: 4 }}
        />
      </CardContent>
    </Card>
  );
}

export default DailyRewards;
