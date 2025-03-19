import { Box, BoxProps } from '@mui/system';
import { WatchitLoader } from '@src/components/watchit-loader';
import { COLORS } from '@src/layouts/config-layout.ts';
import Stack from '@mui/material/Stack';
import TextMaxLine from '@src/components/text-max-line';
import { IconCheck, IconLoader, IconSquare } from '@tabler/icons-react';
import { styled, keyframes } from '@mui/material/styles';
import { useAuth } from '@src/hooks/use-auth.ts';

interface LoaderContainerProps extends BoxProps {
  show: boolean;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const IconLoaderStyled = styled(IconLoader)`
  animation: ${spin} 2s linear infinite;
`;

const IconSquaredStyledFullyTransparent = styled(IconSquare)`
  opacity: 0;
`;

const LoaderContainer = styled(Box)<LoaderContainerProps>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: fixed;
  width: 100%;
  transition: all 1s ease-in-out;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.GRAY_LIGHT_50};
  z-index: 99999;
`;

const InnerBox = styled(Box)`
  width: 90%;
  max-width: 400px;
  padding: 32px;
  border-radius: 32px !important;
  display: flex;
  border-color: #4a33b8;
  border-width: 2px;
  border-style: solid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: ${COLORS.GRAY_LIGHT};
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
`;

const BoxItem = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const LoaderDuringCreationProfile = () => {
  const { modalCreationProfile, profileCreationSteps } = useAuth();

  return (
    <LoaderContainer show={modalCreationProfile}>
      <InnerBox>
        <WatchitLoader style={{ paddingTop: 2 }} />

        <Box flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
          <TextMaxLine variant={'h6'} line={1} sx={{ textAlign: 'center', width: '100%', mt: 0 }}>
            Setting up your profile
          </TextMaxLine>
          <TextMaxLine
            variant={'body1'}
            color="text.secondary"
            line={1}
            sx={{ textAlign: 'center', width: '100%', mt: 1 }}
          >
            Please wait
          </TextMaxLine>
        </Box>

        <Stack direction={'column'} sx={{ gap: 3, mt: 6, width: '100%' }}>
          <BoxItem>
            {profileCreationSteps.step1 === 'running' ? (
              <IconLoaderStyled stroke={2} />
            ) : profileCreationSteps.step1 === 'finished' ? (
              <IconCheck color={'#4a33b8'} stroke={2} />
            ) : (
              <IconSquaredStyledFullyTransparent />
            )}
            <TextMaxLine
              line={1}
              sx={{
                textAlign: 'right',
                width: '100%',
                opacity: profileCreationSteps.step1 === 'idle' ? 0.3 : 1,
              }}
            >
              Creating your profile.
            </TextMaxLine>
          </BoxItem>
          <BoxItem>
            {profileCreationSteps.step2 === 'running' ? (
              <IconLoaderStyled stroke={2} />
            ) : profileCreationSteps.step2 === 'finished' ? (
              <IconCheck color={'#4a33b8'} stroke={2} />
            ) : (
              <IconSquaredStyledFullyTransparent />
            )}
            <TextMaxLine
              line={1}
              sx={{
                textAlign: 'right',
                width: '100%',
                opacity: profileCreationSteps.step2 === 'idle' ? 0.3 : 1,
              }}
            >
              Storing your data on blockchain.
            </TextMaxLine>
          </BoxItem>
          <BoxItem>
            {profileCreationSteps.step3 === 'running' ? (
              <IconLoaderStyled stroke={2} />
            ) : profileCreationSteps.step3 === 'finished' ? (
              <IconCheck color={'#4a33b8'} stroke={2} />
            ) : (
              <IconSquaredStyledFullyTransparent />
            )}
            <TextMaxLine
              line={1}
              sx={{
                textAlign: 'right',
                width: '100%',
                opacity: profileCreationSteps.step3 === 'idle' ? 0.3 : 1,
              }}
            >
              Done.
            </TextMaxLine>
          </BoxItem>
        </Stack>
      </InnerBox>
    </LoaderContainer>
  );
};

export default LoaderDuringCreationProfile;
