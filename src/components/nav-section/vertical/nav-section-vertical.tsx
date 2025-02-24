import { memo, useState, useCallback } from 'react'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import { navVerticalConfig } from '../config'
import { NavSectionProps, NavListProps, NavConfigProps } from '../types'
import NavList from './nav-list'
import { StyledSubheader } from './styles'

function NavSectionVertical({ data, config, sx, ...other }: NavSectionProps) {
  return (
    <Stack sx={sx} {...other}>
      {data.map((group, index) => (
        <Group
          key={group.subheader || index}
          items={group.items}
          config={navVerticalConfig(config)}
          subheader={group?.subheader || ''}
        />
      ))}
    </Stack>
  )
}

export default memo(NavSectionVertical)

type GroupProps = {
  subheader: string;
  items: NavListProps[];
  config: NavConfigProps;
};

function Group({ subheader, items, config }: GroupProps) {
  const [open, setOpen] = useState(true)

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const renderContent = items.map((list) => (
    <NavList
      key={list.title + list.path}
      data={list}
      depth={1}
      hasChild={!!list.children}
      config={config}
    />
  ))

  return (
    <List disablePadding sx={{ px: 2 }}>
      {subheader ? (
        <>
          <StyledSubheader disableGutters disableSticky onClick={handleToggle} config={config}>
            {subheader}
          </StyledSubheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </List>
  )
}
