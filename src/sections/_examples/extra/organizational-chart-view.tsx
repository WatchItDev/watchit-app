// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _mock } from 'src/_mock';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import OrganizationalChart from 'src/components/organizational-chart';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

export default function OrganizationalChartView() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Organizational Chart"
            links={[
              { name: 'Components', href: paths.components },
              { name: 'Organizational Chart' },
            ]}
            moreLink={[
              'https://www.npmjs.com/package/react-organizational-chart',
              'https://daniel-hauser.github.io/react-organizational-chart/?path=/story/example-tree--basic',
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <ComponentBlock title="Simple">
            <OrganizationalChart data={SIMPLE_DATA} lineColor={theme.palette.primary.light} />
          </ComponentBlock>

          <ComponentBlock title="Standard" sx={{ overflow: 'auto' }}>
            <OrganizationalChart data={SIMPLE_DATA} variant="standard" lineHeight="40px" />
          </ComponentBlock>

          <ComponentBlock title="By Group" sx={{ overflow: 'auto' }}>
            <OrganizationalChart data={DATA} variant="group" lineHeight="64px" />
          </ComponentBlock>
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

const createData = (
  name: string,
  group: string,
  role: string | null,
  avatarUrl: string | null
) => ({
  name,
  group,
  role,
  avatarUrl,
});

const SIMPLE_DATA = {
  ...createData('tasha mcneill', 'root', 'ceo, co-founder', _mock.image.avatar(1)),
  children: [
    {
      ...createData('john stone', 'product design', 'lead', _mock.image.avatar(2)),
      children: [
        {
          ...createData('rimsha wynn', 'product design', 'senior', _mock.image.avatar(3)),
          children: null,
        },
      ],
    },
    {
      ...createData('ponnappa priya', 'development', 'lead', _mock.image.avatar(4)),
      children: [
        {
          ...createData('tyra elliott', 'development', 'senior', _mock.image.avatar(5)),
          children: [
            {
              ...createData(
                'sheridan mckee',
                'development',
                'back end developer',
                _mock.image.avatar(6)
              ),
              children: [
                {
                  ...createData(
                    'ang li',
                    'development',
                    'back end developer',
                    _mock.image.avatar(7)
                  ),
                  children: null,
                },
              ],
            },
            {
              ...createData('hope ahmad', 'development', 'front end', _mock.image.avatar(8)),
              children: null,
            },
          ],
        },
      ],
    },
    {
      ...createData('peter stanbridge', 'marketing', 'lead', _mock.image.avatar(9)),
      children: [
        {
          ...createData('madeline harding', 'marketing', 'support', _mock.image.avatar(10)),
          children: null,
        },
        {
          ...createData('eoin medrano', 'marketing', 'content writer', _mock.image.avatar(11)),
          children: null,
        },
      ],
    },
  ],
};

const DATA = {
  ...createData('tasha mcneill', 'root', 'ceo, co-founder', _mock.image.avatar(1)),
  children: [
    {
      ...createData('product design', 'product design', null, null),
      children: [
        {
          ...createData('john stone', 'product design', 'lead', _mock.image.avatar(2)),
          children: [
            {
              ...createData('rimsha wynn', 'product design', 'senior', _mock.image.avatar(3)),
              children: null,
            },
          ],
        },
      ],
    },
    {
      ...createData('development', 'development', null, null),
      children: [
        {
          ...createData('ponnappa priya', 'development', 'lead', _mock.image.avatar(4)),
          children: [
            {
              ...createData('tyra elliott', 'development', 'senior', _mock.image.avatar(5)),
              children: [
                {
                  ...createData(
                    'sheridan mckee',
                    'development',
                    'back end developer',
                    _mock.image.avatar(6)
                  ),
                  children: [
                    {
                      ...createData(
                        'ang li',
                        'development',
                        'back end developer',
                        _mock.image.avatar(7)
                      ),
                      children: null,
                    },
                  ],
                },
                {
                  ...createData('hope ahmad', 'development', 'front end', _mock.image.avatar(8)),
                  children: null,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      ...createData('marketing', 'marketing', null, null),
      children: [
        {
          ...createData('peter stanbridge', 'marketing', 'lead', _mock.image.avatar(9)),
          children: [
            {
              ...createData('madeline harding', 'marketing', 'support', _mock.image.avatar(10)),
              children: null,
            },
            {
              ...createData('eoin medrano', 'marketing', 'content writer', _mock.image.avatar(11)),
              children: null,
            },
          ],
        },
      ],
    },
  ],
};
