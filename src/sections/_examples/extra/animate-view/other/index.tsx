import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
// components
import Iconify from 'src/components/iconify';
//
import Logo from './logo';
import Buttons from './buttons';
import ComponentBlock from '../../../component-block';

// ----------------------------------------------------------------------

export default function Other() {
  const [count, setCount] = useState(0);

  return (
    <Card>
      <CardContent>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <ComponentBlock title="Button Click">
            <Buttons />
          </ComponentBlock>

          <ComponentBlock title="Path">
            <IconButton
              onClick={() => setCount(count + 1)}
              sx={{ position: 'absolute', right: 40, top: 40 }}
            >
              <Iconify icon="eva:refresh-fill" />
            </IconButton>

            <Logo key={count} />
          </ComponentBlock>
        </Box>
      </CardContent>
    </Card>
  );
}
