import { useEffect, FC } from 'react';
import { icons } from '@tabler/icons-react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Label from '@src/components/label';
import { useResponsive } from '@src/hooks/use-responsive.ts';
import { HeaderContentProps } from './types';

const HeaderContent: FC<HeaderContentProps> = ({ handleBack, title }) => {
  const mdUp = useResponsive('up', 'md');

  useEffect(() => {
    if (!handleBack) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBack]);

  if (!mdUp) return <></>;

  return (
    <>
      {handleBack && (
        <Button
          onClick={handleBack}
          disableFocusRipple
          startIcon={<icons.IconChevronLeft size={20} />}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#24262A',
            borderRadius: 1.5,
            m: 1,
            gap: 1,
            p: 1,
            '&:hover': {
              backgroundColor: '#1E1F22',
            },
          }}
        >
          <Typography variant="subtitle2">Back</Typography>
          {mdUp && (
            <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>Esc</Label>
          )}
        </Button>
      )}

      {mdUp && (
        <Typography variant="h6" sx={{ ml: 2 }}>
          {title}
        </Typography>
      )}
    </>
  );
};

export default HeaderContent;
