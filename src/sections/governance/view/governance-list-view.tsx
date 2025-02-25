import {useCallback, useState} from "react";
// @mui
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// routes
import {paths} from "@src/routes/paths";
import {RouterLink} from "@src/routes/components";
// hooks
import {useDebounce} from "@src/hooks/use-debounce";
import {useResponsive} from "@src/hooks/use-responsive";
// components
import Iconify from "@src/components/iconify";
import {useSettingsContext} from "@src/components/settings";
import SvgColor from "@src/components/svg-color";
import GovernanceSearch from "../governance-search";
import GovernanceListHorizontal from "../governance-list-horizontal";
import Label from "../../../components/label";
import Header from "../../../layouts/dashboard/header";
import {useRouter} from "@src/routes/hooks";
import {ProposalsMockList} from "../governance-mock";
// import { useSearchPosts } from '../../../api/blog';

// ----------------------------------------------------------------------

export default function GovernanceListView() {
  const settings = useSettingsContext();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery);

  // const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const mdUp = useResponsive("up", "md");

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleBack = () => {
    router.push(paths.dashboard.root);
  };

  const governanceSteps = [
    {
      label: "Phase 1",
      title: "Proposal Submission",
      description: `In this phase, any community member can submit a proposal for changes or new features to the protocol. These proposals can cover anything from adjusting transaction fees, modifying content policies, or adding new platform functionalities. Proposals must be clear and well-structured, detailing the potential benefits and impacts on the ecosystem. Before moving to the next phase, they must meet certain criteria to ensure feasibility and alignment with Watchit’s goals.`,
    },
    {
      label: "Phase 2",
      title: "Discussion Period",
      description: `Once a proposal is submitted, it enters the discussion phase. The community debates the proposal, providing feedback, raising concerns, and suggesting improvements. This collaborative discussion helps refine the proposal and ensures it aligns with the community’s interests. The goal is to reach a consensus on any modifications before moving forward to the voting phase.`,
    },
    {
      label: "Phase 3",
      title: "Voting Process",
      description: `After the discussion, the proposal moves to a vote. Token holders cast their votes based on the number of MMC tokens they hold. The voting process is transparent and secure, conducted through smart contracts to ensure fairness. If the majority approves the proposal, it is automatically implemented on the blockchain, making it an official part of the protocol.`,
    },
  ];

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Header>
        <Button
          onClick={handleBack}
          disableFocusRipple
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#24262A",
            borderRadius: 1.5,
            m: 1,
            p: 0.2,
            "&:hover": {
              backgroundColor: "#1E1F22",
            },
          }}>
          <IconButton disableRipple>
            <Iconify icon="tabler:chevron-left" width={20} height={20} />
            <Typography sx={{ml: 1}} variant="subtitle2">
              Back
            </Typography>
          </IconButton>

          {mdUp && <Label sx={{px: 0.75, mr: 1, fontSize: 12, color: "text.secondary"}}>Esc</Label>}
        </Button>
      </Header>
      <Container maxWidth={settings.themeStretch ? false : "lg"} sx={{py: 5}}>
        <Grid container spacing={3} sx={{margin: "0 !important", width: "100% !important"}}>
          <Grid xs={12} md={4} sx={{pl: 2}}>
            <Box sx={{position: "sticky", top: "75px"}}>
              <Card sx={{backgroundColor: "#2B2D31"}}>
                <CardContent>
                  <Stack spacing={1} sx={{alignItems: "center"}}>
                    <Box sx={{width: "3rem", height: "3rem", mt: 2}}>
                      <SvgColor
                        src="/assets/icons/navbar/ic_watchit.svg"
                        sx={{width: 1, height: 1}}
                      />
                    </Box>
                    <Typography variant="h3" sx={{mt: 2}}>
                      Watchit DAO
                    </Typography>
                  </Stack>
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    sx={{mt: 2}}>
                    {governanceSteps.map((step, index) => (
                      <Tab key={index} label={step.label} />
                    ))}
                  </Tabs>
                  <Box sx={{mt: 2}}>
                    <Typography variant="body1" fontWeight="bold" sx={{mb: 1}}>
                      {governanceSteps[selectedTab].title}
                    </Typography>
                    <Typography variant="body1" sx={{mb: 2, color: "text.secondary"}}>
                      {governanceSteps[selectedTab].description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
          <Grid xs={12} md={8} sx={{pl: 2}}>
            <Typography variant="h3" sx={{mb: 4}}>
              Proposals
            </Typography>

            <Stack
              spacing={3}
              justifyContent="space-between"
              alignItems={{xs: "flex-end", sm: "center"}}
              direction={{xs: "column", sm: "row"}}
              sx={{
                mb: {xs: 3, md: 5},
              }}>
              <GovernanceSearch
                query={debouncedQuery}
                results={searchResults}
                onSearch={handleSearch}
                // loading={searchLoading}
                hrefItem={(title: string) => paths.dashboard.governance.details(title)}
              />

              <Button
                component={RouterLink}
                href={paths.dashboard.governance.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}>
                New Post
              </Button>
            </Stack>

            <GovernanceListHorizontal posts={ProposalsMockList} loading={false} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// import { useCallback, useState } from 'react';
// // @mui
// import Stack from '@mui/material/Stack';
// import button from '@mui/material/button';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// // routes
// import { paths } from '@src/routes/paths';
// import { RouterLink } from '@src/routes/components';
// // hooks
// import { useDebounce } from '@src/hooks/use-debounce';
// // api
// import { useGetPosts, useSearchPosts } from '@src/api/blog';
// // components
// import Iconify from '@src/components/iconify';
// import { useSettingsContext } from '@src/components/settings';
// //
// import IconButton from '@mui/material/IconButton';
// import { IconChevronLeft } from '@tabler/icons-react';
// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import Box from '@mui/material/Box';
// import LoadingButton from '@mui/lab/LoadingButton';
// import CardHeader from '@mui/material/CardHeader';
// import Divider from '@mui/material/Divider';
// import CardContent from '@mui/material/CardContent';
// import GovernanceSearch from '../governance-search';
// import GovernanceListHorizontal from '../governance-list-horizontal';
// import Label from '../../../components/label';
// import Header from '../../../layouts/dashboard/header';
// import { useResponsive } from '../../../hooks/use-responsive';
// import MovieNewWizardSummaryControl from '../../movie/movie-new-wizard-summary-control';
// import { ProposalsMockList } from '../governance-mock';
// import Scrollbar from '../../../components/scrollbar/scrollbar';
// import { useRouter } from '../../../routes/hooks';
// import Image from '../../../components/image';
// import SvgColor from '../../../components/svg-color';
//
// // ----------------------------------------------------------------------
//
// export default function GovernanceListView() {
//   const settings = useSettingsContext();
//
//   const router = useRouter();
//
//   const [searchQuery, setSearchQuery] = useState('');
//
//   const debouncedQuery = useDebounce(searchQuery);
//
//   const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);
//
//   const mdUp = useResponsive('up', 'md');
//
//   const handleSearch = useCallback((inputValue: string) => {
//     setSearchQuery(inputValue);
//   }, []);
//
//   const handleBack = () => {
//     router.push(paths.dashboard.root)
//   }
//
//   return (
//     <>
//       <Header>
//         <button
//           onClick={handleBack} disableFocusRipple
//           sx={{
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             backgroundColor: '#24262A',
//             borderRadius: 1.5,
//             m: 1,
//             p: 0.2,
//             '&:hover': {
//               backgroundColor: '#1E1F22'
//             }
//           }}
//         >
//           <IconButton disableRipple>
//             <IconChevronLeft size={20} />
//             <Typography sx={{ ml: 1 }} variant='subtitle2'>Back</Typography>
//           </IconButton>
//
//
//           {mdUp && <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>Esc</Label>}
//         </button>
//       </Header>
//       <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ py: 5 }}>
//          <Grid container spacing={3} sx={{ margin: '0 !important',width: '100% !important' }}>
//           <Grid xs={12} md={4} sx={{ pl: 2 }}>
//             <Box sx={{ position: 'sticky', top: '75px' }}>
//               <Card sx={{ backgroundColor: '#2B2D31' }}>
//                 <CardContent>
//                   <Stack spacing={1} sx={{ alignItems: 'center' }}>
//                     <Box sx={{ width: '3rem', height: '3rem', mt: 2 }}>
//                       <SvgColor src='/assets/icons/navbar/ic_watchit.svg' sx={{ width: 1, height: 1 }} />
//                     </Box>
//                     <Typography variant='h3' sx={{ mt: 2 }}>Watchit DAO</Typography>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Grid>
//           <Grid xs={12} md={8} sx={{ pl: 2 }}>
//             <Typography variant='h3' sx={{ mb: 4 }}>Proposals</Typography>
//
//             <Stack
//               spacing={3}
//               justifyContent="space-between"
//               alignItems={{ xs: 'flex-end', sm: 'center' }}
//               direction={{ xs: 'column', sm: 'row' }}
//               sx={{
//                 mb: { xs: 3, md: 5 },
//               }}
//             >
//               <GovernanceSearch
//                 query={debouncedQuery}
//                 results={searchResults}
//                 onSearch={handleSearch}
//                 loading={searchLoading}
//                 hrefItem={(title: string) => paths.dashboard.governance.details(title)}
//               />
//
//               <button
//                 component={RouterLink}
//                 href={paths.dashboard.governance.new}
//                 variant="contained"
//                 startIcon={<Iconify icon="mingcute:add-line" />}
//               >
//                 New Post
//               </button>
//             </Stack>
//
//             <GovernanceListHorizontal posts={ProposalsMockList} loading={false} />
//            </Grid>
//          </Grid>
//       </Container>
//     </>
//   );
// }
