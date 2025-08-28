import { memo } from 'react';
import Stack from '@mui/material/Stack';
//
import { NavSectionProps, NavListProps, NavConfigProps } from '../types';
import { navMiniConfig } from '../config';
import NavListVerticalMini from '@src/components/nav-section/mini/nav-list-vertical-mini.tsx';

// ----------------------------------------------------------------------

export function NavSectionVerticalMini({
  data,
  config,
  sx,
  ...other
}: NavSectionProps) {
  return (
    <Stack sx={sx} {...other}>
      {data.map((group, index) => (
        <Group
          key={group.subheader || index}
          items={group.items}
          config={navMiniConfig(config)}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionVerticalMini);

// ----------------------------------------------------------------------

interface GroupProps {
  items: NavListProps[];
  config: NavConfigProps;
}

function Group({ items, config }: GroupProps) {
  return (
    <>
      {items.map((list) => (
        <NavListVerticalMini
          key={list.title + list.path}
          data={list}
          depth={1}
          hasChild={!!list.children}
          config={config}
        />
      ))}
    </>
  );
}
