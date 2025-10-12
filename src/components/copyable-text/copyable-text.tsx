import { useState, FC } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Icon } from '@iconify/react';

const copyIcon = 'mdi:content-copy';
const checkIcon = 'mdi:check';

interface CopyableTextProps {
  label: string;
  text: string;
}

const CopyableText: FC<CopyableTextProps> = ({ label, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Stack direction="row" alignItems="center">
      <Typography sx={{ ml: 3 }}>{label}</Typography>
      <Tooltip title={copied ? 'Copied!' : 'Copy'} arrow placement="top">
        <IconButton onClick={handleCopy} sx={{ ml: 1 }}>
          <Icon icon={copied ? checkIcon : copyIcon} width={16} height={16} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default CopyableText;
