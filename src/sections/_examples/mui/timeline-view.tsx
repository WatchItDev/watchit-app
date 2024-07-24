// @mui
import Masonry from '@mui/lab/Masonry';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

type TimelineType = {
  key: number;
  title: string;
  des: string;
  time: string;
  color?: 'primary' | 'info' | 'success' | 'warning' | 'error' | 'inherit' | 'grey' | 'secondary';
  icon: React.ReactElement;
};

const TIMELINES: TimelineType[] = [
  {
    key: 1,
    title: 'Default',
    des: 'Morbi mattis ullamcorper',
    time: '09:30 am',
    icon: <Iconify icon="eva:folder-add-fill" width={24} />,
  },
  {
    key: 2,
    title: 'Primary',
    des: 'Morbi mattis ullamcorper',
    time: '10:00 am',
    color: 'primary',
    icon: <Iconify icon="eva:image-2-fill" width={24} />,
  },
  {
    key: 3,
    title: 'Secondary',
    des: 'Morbi mattis ullamcorper',
    time: '10:00 am',
    color: 'secondary',
    icon: <Iconify icon="eva:pantone-fill" width={24} />,
  },
  {
    key: 4,
    title: 'Info',
    des: 'Morbi mattis ullamcorper',
    time: '10:30 am',
    color: 'info',
    icon: <Iconify icon="eva:tv-fill" width={24} />,
  },
  {
    key: 5,
    title: 'Success',
    des: 'Morbi mattis ullamcorper',
    time: '11:00 am',
    color: 'success',
    icon: <Iconify icon="eva:activity-fill" width={24} />,
  },
  {
    key: 6,
    title: 'Warning',
    des: 'Morbi mattis ullamcorper',
    time: '11:30 am',
    color: 'warning',
    icon: <Iconify icon="eva:cube-fill" width={24} />,
  },
  {
    key: 7,
    title: 'Error',
    des: 'Morbi mattis ullamcorper',
    time: '12:00 am',
    color: 'error',
    icon: <Iconify icon="eva:film-fill" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function TimelineView() {
  const lastItem = TIMELINES[TIMELINES.length - 1].key;

  const reduceTimeLine = TIMELINES.slice(TIMELINES.length - 3);

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Timeline"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Timeline' },
            ]}
            moreLink={['https://mui.com/components/timeline']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 3 }} spacing={3}>
          <ComponentBlock title="Default">
            <Timeline>
              {reduceTimeLine.map((item) => (
                <TimelineItem key={item.key}>
                  <TimelineSeparator>
                    <TimelineDot />
                    {lastItem === item.key ? null : <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>{item.title}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </ComponentBlock>

          <ComponentBlock title="Right">
            <Timeline position="right">
              {reduceTimeLine.map((item) => (
                <TimelineItem key={item.key}>
                  <TimelineSeparator>
                    <TimelineDot />
                    {lastItem === item.key ? null : <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>{item.title}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </ComponentBlock>

          <ComponentBlock title="Alternating">
            <Timeline position="alternate">
              {reduceTimeLine.map((item) => (
                <TimelineItem key={item.key}>
                  <TimelineSeparator>
                    <TimelineDot />
                    {lastItem === item.key ? null : <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>{item.title}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </ComponentBlock>

          <ComponentBlock title="Filled">
            <Timeline position="alternate">
              {TIMELINES.map((item) => (
                <TimelineItem key={item.key}>
                  <TimelineSeparator>
                    <TimelineDot color={item.color} />
                    {lastItem === item.key ? null : <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>{item.title}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </ComponentBlock>

          <ComponentBlock title="Outlined">
            <Timeline position="alternate">
              {TIMELINES.map((item) => (
                <TimelineItem key={item.key}>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color={item.color} />
                    {lastItem === item.key ? null : <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>{item.title}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </ComponentBlock>

          <ComponentBlock title="Opposite content">
            <Timeline position="alternate">
              {TIMELINES.map((item) => (
                <TimelineItem key={item.key}>
                  <TimelineOppositeContent>
                    <Typography sx={{ color: 'text.secondary' }}>{item.time}</Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={item.color} />
                    {lastItem === item.key ? null : <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography> {item.title}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </ComponentBlock>
        </Masonry>

        <ComponentBlock title="Customized">
          <Timeline position="alternate">
            {TIMELINES.map((item) => (
              <TimelineItem key={item.key}>
                <TimelineOppositeContent>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.time}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={item.color}>{item.icon}</TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                    }}
                  >
                    <Typography variant="subtitle2">{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.des}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </ComponentBlock>
      </Container>
    </>
  );
}
