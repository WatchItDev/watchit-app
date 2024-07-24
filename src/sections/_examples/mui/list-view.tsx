import { useState, useCallback } from 'react';
// @mui
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

function ListItemLink(props: ListItemButtonProps<'a', { button?: true }>) {
  return <ListItemButton component="a" {...props} />;
}

export default function ListView() {
  const [open, setOpen] = useState(true);

  const [selectedIndex, setSelectedIndex] = useState(1);

  const [checked, setChecked] = useState([0]);

  const [toggle, setToggle] = useState(['wifi']);

  const handleClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleListItemClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
      setSelectedIndex(index);
    },
    []
  );

  const handleCheck = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleToggle = (value: string) => () => {
    const currentIndex = toggle.indexOf(value);
    const newChecked = [...toggle];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setToggle(newChecked);
  };

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
            heading="List"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Lists' },
            ]}
            moreLink={['https://mui.com/components/lists']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
          <ComponentBlock title="Simple">
            <Paper variant="outlined" sx={{ width: 1 }}>
              <List component="nav" aria-label="main mailbox folders">
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="solar:inbox-in-bold" width={24} />
                  </ListItemIcon>
                  <ListItemText primary="Inbox" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="fluent:mail-24-filled" width={24} />
                  </ListItemIcon>
                  <ListItemText primary="Drafts" />
                </ListItemButton>
              </List>

              <Divider />

              <List component="nav" aria-label="secondary mailbox folders">
                <ListItemButton>
                  <ListItemText primary="Trash" />
                </ListItemButton>
                <ListItemLink href="#simple-list">
                  <ListItemText primary="Spam" />
                </ListItemLink>
              </List>
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Nested">
            <Paper variant="outlined" sx={{ width: 1 }}>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Nested List Items
                  </ListSubheader>
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="iconamoon:send-fill" width={24} />
                  </ListItemIcon>
                  <ListItemText primary="Sent mail" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="fluent:mail-24-filled" width={24} />
                  </ListItemIcon>
                  <ListItemText primary="Drafts" />
                </ListItemButton>
                <ListItemButton onClick={handleClick}>
                  <ListItemIcon>
                    <Iconify icon="solar:inbox-in-bold" width={24} />
                  </ListItemIcon>
                  <ListItemText primary="Inbox" />
                  {open ? (
                    <Iconify icon="eva:arrow-ios-upward-fill" />
                  ) : (
                    <Iconify icon="eva:arrow-ios-downward-fill" />
                  )}
                </ListItemButton>
                <Collapse in={open} unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Iconify icon="ic:round-star-border" width={24} />
                      </ListItemIcon>
                      <ListItemText primary="Starred" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Folder">
            <Paper variant="outlined" sx={{ width: 1 }}>
              <List>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar>
                      <Iconify icon="ic:baseline-image" width={24} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar>
                      <Iconify icon="ic:baseline-work" width={24} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Work" secondary="Jan 7, 2014" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar>
                      <Iconify icon="ic:round-beach-access" width={24} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Vacation" secondary="July 20, 2014" />
                </ListItemButton>
              </List>
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Selected">
            <Paper variant="outlined" sx={{ width: 1 }}>
              <List component="nav" aria-label="main mailbox folders">
                <ListItemButton
                  selected={selectedIndex === 0}
                  onClick={(event) => handleListItemClick(event, 0)}
                >
                  <ListItemIcon>
                    <Iconify icon="solar:inbox-in-bold" width={24} />
                  </ListItemIcon>
                  <ListItemText primary="Inbox" />
                </ListItemButton>
                <ListItemButton
                  selected={selectedIndex === 1}
                  onClick={(event) => handleListItemClick(event, 1)}
                >
                  <ListItemIcon>
                    <Iconify icon="fluent:mail-24-filled" width={24} />
                  </ListItemIcon>
                  <ListItemText primary="Drafts" />
                </ListItemButton>
              </List>

              <Divider />

              <List component="nav" aria-label="secondary mailbox folder">
                <ListItemButton
                  selected={selectedIndex === 2}
                  onClick={(event) => handleListItemClick(event, 2)}
                >
                  <ListItemText primary="Trash" />
                </ListItemButton>
                <ListItemButton
                  selected={selectedIndex === 3}
                  onClick={(event) => handleListItemClick(event, 3)}
                >
                  <ListItemText primary="Spam" />
                </ListItemButton>
              </List>
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Controls">
            <Paper variant="outlined" sx={{ width: 1 }}>
              <List>
                {[0, 1, 2, 3].map((value) => {
                  const labelId = `checkbox-list-label-${value}`;
                  return (
                    <ListItemButton key={value} role={undefined} dense onClick={handleCheck(value)}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>

                      <ListItemText id={labelId} primary={`Line item ${value + 1}`} />

                      <ListItemSecondaryAction>
                        <IconButton edge="end">
                          <Iconify icon="solar:chat-round-dots-bold" width={24} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItemButton>
                  );
                })}
              </List>
            </Paper>
          </ComponentBlock>

          <ComponentBlock title="Switch">
            <Paper variant="outlined" sx={{ width: 1 }}>
              <List subheader={<ListSubheader>Settings</ListSubheader>}>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="ic:baseline-wifi" width={24} />
                  </ListItemIcon>
                  <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      onChange={handleToggle('wifi')}
                      checked={toggle.indexOf('wifi') !== -1}
                      inputProps={{
                        'aria-labelledby': 'switch-list-label-wifi',
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <Iconify icon="ic:baseline-bluetooth" width={24} />
                  </ListItemIcon>
                  <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      onChange={handleToggle('bluetooth')}
                      checked={toggle.indexOf('bluetooth') !== -1}
                      inputProps={{
                        'aria-labelledby': 'switch-list-label-bluetooth',
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItemButton>
              </List>
            </Paper>
          </ComponentBlock>
        </Masonry>
      </Container>
    </>
  );
}
