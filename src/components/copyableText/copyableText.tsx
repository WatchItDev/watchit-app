import { useState, FC } from 'react';
import { Tooltip, IconButton, Typography, Stack } from '@mui/material';
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
