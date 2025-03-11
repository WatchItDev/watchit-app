import { useRef, useState, useEffect, FC } from 'react';
import { Box, Button } from '@mui/material';
import { m } from 'framer-motion';

import Markdown from '@src/components/markdown';
import { varFade } from '@src/components/animate';
import { trimPublicationContentExtraText } from '@src/utils/text-transform';
import { PublicationTitleDescriptionProps } from '@src/sections/publication/types.ts';
import { PUBLICATION_DESCRIPTION_MAX_LINES } from '@src/sections/publication/CONSTANTS.ts';
import Typography from '@mui/material/Typography';

export const PublicationTitleDescription: FC<PublicationTitleDescriptionProps> = ({ publication }) => {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [showToggle, setShowToggle] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);

  const variants = varFade().inRight;

  function toggleDescription(): void {
    setShowToggle(!showToggle);
  }

  useEffect(() => {
    if (!descriptionRef.current) return;
    const lineHeightStr = window.getComputedStyle(descriptionRef.current).lineHeight;
    const lineHeight = parseInt(lineHeightStr || '24', 10);
    const maxHeight = lineHeight * PUBLICATION_DESCRIPTION_MAX_LINES;

    if (descriptionRef.current.scrollHeight > maxHeight) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [publication?.metadata?.content]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end', mt: 3 }}
    >
      <m.div variants={variants}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5, width: '100%' }}
          gutterBottom
        >
          {publication?.metadata?.title}
        </Typography>
      </m.div>
      <Box sx={{ mt: 2, position: 'relative' }}>
        <m.div variants={variants}>
          <Box
            ref={descriptionRef}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: showToggle ? 'none' : PUBLICATION_DESCRIPTION_MAX_LINES,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              opacity: 0.8,
            }}
          >
            <Markdown children={trimPublicationContentExtraText(publication?.metadata?.content)} />
          </Box>
          {showButton && (
            <Button variant="outlined" onClick={toggleDescription} sx={{ mt: 2 }}>
              {showToggle ? 'Show less' : 'Show more'}
            </Button>
          )}
        </m.div>
      </Box>
    </Box>
  );
}
