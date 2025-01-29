import { Box, styled } from '@mui/material';

interface StrategyCirclesProps {
  color: string;
  theme?: any;
}

const StrategyCircles = ({color}: StrategyCirclesProps) => {
  return (
    <CircleContainer>
      <MainCircle color={color}>
        <InnerCircle color={color}>
          <CenterCircle color={color} />
        </InnerCircle>
      </MainCircle>
    </CircleContainer>
  );
};

const CircleContainer = styled(Box)(() => ({
  position: 'absolute',
  bottom: -30,
  right: -35,
  opacity: 0.5,
  zIndex: 1,
}));

const MainCircle = styled(Box)(({ color }: StrategyCirclesProps) => ({
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  border: `8px solid ${color}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const InnerCircle = styled(Box)(({ color }: StrategyCirclesProps) => ({
  width: '75px',
  height: '75px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `8px solid ${color}`,
}));

const CenterCircle = styled(Box)(({ color }: StrategyCirclesProps) => ({
  width: '25px',
  height: '25px',
  borderRadius: '50%',
  border: `8px solid ${color}`,
}));

export default StrategyCircles;
