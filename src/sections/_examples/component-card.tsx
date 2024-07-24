import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
// components
import Image from 'src/components/image';
import { RouterLink } from 'src/routes/components';
import { varHover, varTranHover } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  item: {
    name: string;
    icon: string;
    href: string;
  };
};

export default function ComponentCard({ item }: Props) {
  const { name, icon, href } = item;

  return (
    <Paper
      component={RouterLink}
      href={href}
      variant="outlined"
      sx={{
        overflow: 'hidden',
        textDecoration: 'none',
        borderColor: (theme) => alpha(theme.palette.grey[500], 0.08),
      }}
    >
      <CardActionArea
        component={m.div}
        whileHover="hover"
        sx={{
          p: 2.5,
          borderRadius: 0,
          color: 'text.secondary',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        }}
      >
        <m.div variants={varHover(1.1)} transition={varTranHover()}>
          <Image alt={name} src={icon} />
        </m.div>
      </CardActionArea>

      <Typography variant="subtitle2" sx={{ p: 2, textAlign: 'center' }}>
        {name}
      </Typography>
    </Paper>
  );
}
