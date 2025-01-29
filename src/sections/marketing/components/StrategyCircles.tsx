import { Box, styled } from '@mui/material';
import {useResponsive} from "@src/hooks/use-responsive.ts";

interface StrategyCirclesProps {
  color: string;
  lgUp?: boolean;
}

const StrategyCircles = ({color}: StrategyCirclesProps) => {
  const lgUp = useResponsive('up','md');

  return (
    <CircleContainer>
      <MainCircle color={color} lgUp={lgUp}>
        <InnerCircle color={color}  lgUp={lgUp}>
          <CenterCircle color={color}  lgUp={lgUp} />
        </InnerCircle>
      </MainCircle>
    </CircleContainer>
  );
};

const CircleContainer = styled(Box)(() => ({
  position: 'absolute',
  bottom: -30,
  right: -35,
  opacity: 0.2,
  zIndex: 1,
}));

const MainCircle = styled(Box)(({ color, lgUp }: StrategyCirclesProps) => ({
  width: lgUp ? '150px' : '100px',
  height: lgUp ? '150px' : '100px',
  borderRadius: '50%',
  border: `${lgUp ? 8 : 6}px solid ${color}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const InnerCircle = styled(Box)(({ color, lgUp }: StrategyCirclesProps) => ({
  width: lgUp ? '75px' : '50px',
  height: lgUp ? '75px' : '50px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `${lgUp ? 8 : 6}px solid ${color}`,
}));

const CenterCircle = styled(Box)(({ color, lgUp }: StrategyCirclesProps) => ({
  width: lgUp ? '25px' : '15px',
  height: lgUp ? '25px' : '15px',
  borderRadius: '50%',
  border: `${lgUp ? 8 : 6}px solid ${color}`,
}));

export default StrategyCircles;
