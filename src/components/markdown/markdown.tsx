// utils
import '@src/utils/highlight';
import ReactMarkdown from 'react-markdown';
// markdown plugins
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
// @mui
import Link from '@mui/material/Link';
// routes
import { RouterLink } from '@src/routes/components';
//
import Image from '../image';
//
import StyledMarkdown from './styles';
import { MarkdownProps } from './types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function Markdown({ sx, ...other }: MarkdownProps) {
  return (
    <StyledMarkdown sx={sx}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight, [remarkGfm, { singleTilde: false }]]}
        components={components}
        {...other}
      />
    </StyledMarkdown>
  );
}

// ----------------------------------------------------------------------

const CustomHeader = (props: any) => (
  <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>
    {props.children}
  </Typography>
);

const components = {
  img: ({ ...props }) => <Image alt={props.alt} ratio="16/9" sx={{ borderRadius: 2 }} {...props} />,
  a: ({ ...props }) => {
    const isHttp = props.href.includes('http');

    return isHttp ? (
      <Link target="_blank" rel="noopener" sx={{ color: '#3ea6ff' }} {...props} />
    ) : (
      <Link component={RouterLink} href={props.href} sx={{ color: '#3ea6ff' }} {...props}>
        {props.children}
      </Link>
    );
  },
  h1: ({ node, ...props }) => <CustomHeader {...props} />,
  h2: ({ node, ...props }) => <CustomHeader {...props} />,
  h3: ({ node, ...props }) => <CustomHeader {...props} />,
  h4: ({ node, ...props }) => <CustomHeader {...props} />,
  h5: ({ node, ...props }) => <CustomHeader {...props} />,
  h6: ({ node, ...props }) => <CustomHeader {...props} />,
  p: ({ node, ...props }) => (
    <Typography variant="body1" style={{ lineHeight: 1.6, mt: 2 }} {...props} />
  ),
  hr: ({ ...props }) => (
    <Box
      sx={{ mt: 4, mb: 4, border: 'none', borderTop: '1px solid rgba(255,255,255,0.5)' }}
      {...props}
    />
  ),
};
