import { useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import IconButton from '@mui/material/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { m } from 'framer-motion';
import { fShortenNumber } from '@src/utils/format-number';
import Iconify from '@src/components/iconify';
import Markdown from '@src/components/markdown';
import LoadingButton from '@mui/lab/LoadingButton';
import { truncateAddress } from '../../../utils/wallet';
import GovernanceCommentList from '../governance-comment-list';
import GovernanceCommentForm from '../governance-comment-form';
import Label from '../../../components/label';
import Header from '../../../layouts/dashboard/header';
import { useResponsive } from '../../../hooks/use-responsive';
import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';
import { ProposalsMockList, proposalVotes as initialProposalVotes } from '../governance-mock';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

export default function GovernanceDetailsView({ title }: Props) {
  const post = ProposalsMockList[0];
  const mdUp = useResponsive('up', 'md');
  const router = useRouter();

  const handleBack = () => {
    router.push(paths.dashboard.governance.root);
  };

  const [userVote, setUserVote] = useState<string | null>(null);
  const [proposalVotes, setProposalVotes] = useState(initialProposalVotes);
  const [loadingVoteType, setLoadingVoteType] = useState<string | null>(null);

  const totalVotes =
    proposalVotes.results.forVotes +
    proposalVotes.results.againstVotes +
    proposalVotes.results.abstainVotes;

  const handleVote = (voteType: 'for' | 'against' | 'abstain') => {
    setLoadingVoteType(voteType);

    setTimeout(() => {
      setLoadingVoteType(null);
      setUserVote(voteType);

      // Adjust votes results
      const updatedResults = { ...proposalVotes.results };
      if (voteType === 'for') {
        updatedResults.forVotes += 100000;
      } else if (voteType === 'against') {
        updatedResults.againstVotes += 100000;
      } else if (voteType === 'abstain') {
        updatedResults.abstainVotes += 100000;
      }

      // Update the list with the new vote
      const updatedVotes = [
        {
          user: 'you',
          direction: voteType,
          amount: 100000,
        },
        ...proposalVotes.votes,
      ];

      setProposalVotes({
        ...proposalVotes,
        results: updatedResults,
        votes: updatedVotes,
      });
    }, 2000);
  };

  const renderPost = post && (
    <Grid container spacing={1} sx={{ margin: '0 !important', width: '100% !important', pt: 5 }}>
      <Grid xs={12} md={8}>
        <Stack
          sx={{
            maxWidth: 720,
            mx: 'auto',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-start" sx={{ mb: 2 }}>
            <Label variant="soft" color={post.publish === 'active' ? 'success' : 'error'}>
              {post.publish}
            </Label>
          </Stack>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {post.description}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-start" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex' }}>
              <Avatar
                src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${post?.author?.wallet}`}
                alt={post?.author?.name}
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                }}
              />
              <Typography variant="subtitle2" noWrap>
                {truncateAddress(post?.author?.wallet)}
              </Typography>
            </Box>
          </Stack>

          <Markdown>{post.content}</Markdown>

          <Stack
            spacing={3}
            sx={{
              py: 3,
              borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
              borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {post.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="soft" />
              ))}
            </Stack>

            <Stack direction="row" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    size="small"
                    color="error"
                    icon={<Iconify icon="solar:heart-bold" />}
                    checkedIcon={<Iconify icon="solar:heart-bold" />}
                  />
                }
                label={fShortenNumber(post.totalFavorites)}
                sx={{ mr: 1 }}
              />

              <AvatarGroup
                sx={{
                  [`& .${avatarGroupClasses.avatar}`]: {
                    width: 32,
                    height: 32,
                  },
                }}
              >
                {post.favoritePerson.map((person) => (
                  <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
                ))}
              </AvatarGroup>
            </Stack>
          </Stack>

          <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
            <Typography variant="h4">Comentarios</Typography>

            <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
              ({post.comments.length})
            </Typography>
          </Stack>

          <GovernanceCommentForm />

          <Divider sx={{ mt: 5, mb: 2 }} />

          <GovernanceCommentList comments={post.comments as any} />
        </Stack>
      </Grid>
      <Grid xs={12} md={4} sx={{ pl: 2 }}>
        <Box sx={{ position: 'sticky', top: '75px' }}>
          <Card
            component={m.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ backgroundColor: '#2B2D31' }}
          >
            <CardContent>
              <Typography variant="h6">Voting results</Typography>
              <Stack>
                <Stack
                  spacing={2}
                  sx={{ mt: 2, mb: 1, alignItems: 'center', justifyContent: 'space-between' }}
                  direction="row"
                >
                  <Typography variant="body2" fontWeight="700">
                    In Favor
                  </Typography>
                  <Typography variant="body2" fontWeight="700">
                    {fShortenNumber(proposalVotes.results.forVotes)} MMC
                  </Typography>
                </Stack>
                <CustomLinearProgress
                  variant="determinate"
                  value={(proposalVotes.results.forVotes / totalVotes) * 100}
                />

                <Stack
                  spacing={2}
                  sx={{ mt: 2, mb: 1, alignItems: 'center', justifyContent: 'space-between' }}
                  direction="row"
                >
                  <Typography variant="body2" fontWeight="700">
                    Against
                  </Typography>
                  <Typography variant="body2" fontWeight="700">
                    {fShortenNumber(proposalVotes.results.againstVotes)} MMC
                  </Typography>
                </Stack>
                <CustomLinearProgress
                  variant="determinate"
                  value={(proposalVotes.results.againstVotes / totalVotes) * 100}
                />

                <Stack
                  spacing={2}
                  sx={{ mt: 2, mb: 1, alignItems: 'center', justifyContent: 'space-between' }}
                  direction="row"
                >
                  <Typography variant="body2" fontWeight="700">
                    Abstention
                  </Typography>
                  <Typography variant="body2" fontWeight="700">
                    {fShortenNumber(proposalVotes.results.abstainVotes)} MMC
                  </Typography>
                </Stack>
                <CustomLinearProgress
                  variant="determinate"
                  value={(proposalVotes.results.abstainVotes / totalVotes) * 100}
                />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6">Cast your vote</Typography>
              {post.publish === 'active' ? (
                <>
                  <Stack spacing={1} sx={{ mt: 2 }} direction="row">
                    <LoadingButton
                      variant={userVote === 'for' ? 'contained' : 'outlined'}
                      onClick={() => handleVote('for')}
                      loading={loadingVoteType === 'for'}
                      disabled={userVote !== null}
                      sx={{ flexGrow: 1 }}
                    >
                      For
                    </LoadingButton>
                    <LoadingButton
                      variant={userVote === 'against' ? 'contained' : 'outlined'}
                      onClick={() => handleVote('against')}
                      loading={loadingVoteType === 'against'}
                      disabled={userVote !== null}
                      sx={{ flexGrow: 1 }}
                    >
                      Against
                    </LoadingButton>
                    <LoadingButton
                      variant={userVote === 'abstain' ? 'contained' : 'outlined'}
                      onClick={() => handleVote('abstain')}
                      loading={loadingVoteType === 'abstain'}
                      disabled={userVote !== null}
                      sx={{ flexGrow: 1 }}
                    >
                      Abstain
                    </LoadingButton>
                  </Stack>
                  {userVote && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="success.main">
                        {/* eslint-disable-next-line no-nested-ternary */}
                        You have already voted:{' '}
                        {userVote === 'for'
                          ? 'In Favor'
                          : userVote === 'against'
                            ? 'Against'
                            : 'Abstain'}
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  Voting has ended
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Stack spacing={1} sx={{ mt: 2, alignItems: 'center' }} direction="row">
                <Typography variant="h6">Votes</Typography>
                <Label variant="soft">{proposalVotes.votes.length}</Label>
              </Stack>

              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {proposalVotes.votes.map((vote, index) => (
                    <Box key={index} display="flex" alignItems="center" justifyContent="flex-start">
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{ width: '40%', minWidth: '40%', maxWidth: '40%', mr: 3 }}
                      >
                        <Avatar
                          src={`https://api.dicebear.com/6.x/identicon/svg?seed=${vote.user}`}
                          alt={vote.user}
                          sx={{ width: 20, height: 20, mr: 1 }}
                        />
                        <Typography variant="body2">{truncateAddress(vote.user)}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="700" sx={{ flexGrow: 1 }}>
                        {vote.direction}
                      </Typography>
                      <Typography variant="body2" fontWeight="700">
                        {fShortenNumber(vote.amount)} MMC
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <>
      <Header>
        <Button
          onClick={handleBack}
          disableFocusRipple
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#24262A',
            borderRadius: 1.5,
            m: 1,
            p: 0.2,
            '&:hover': {
              backgroundColor: '#1E1F22',
            },
          }}
        >
          <IconButton disableRipple>
            <IconChevronLeft size={20} />
            <Typography sx={{ ml: 1 }} variant="subtitle2">
              Back
            </Typography>
          </IconButton>

          {mdUp && (
            <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>Esc</Label>
          )}
        </Button>
      </Header>
      <Container>{post && renderPost}</Container>
    </>
  );
}

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#fff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#fff',
    }),
  },
}));
