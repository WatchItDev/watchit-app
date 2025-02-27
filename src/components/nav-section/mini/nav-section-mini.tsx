import { memo } from 'react';
//
import { NavListProps, NavConfigProps } from '../types';
import NavList from './nav-list';

// ----------------------------------------------------------------------

interface GroupProps {
  items: NavListProps[];
  activeId?: string;
  config: NavConfigProps;
  onClick?: (id: string) => void;
}

function NavSectionMini({ items, activeId, config, onClick }: GroupProps) {
  return (
    <>
      {items.map((list) => (
        <NavList
          key={list.title + list.path}
          active={activeId === list.id}
          data={list}
          depth={1}
          config={config}
          onClick={() => {
            onClick?.(list.id ?? '');
          }}
        />
      ))}
    </>
  );
}

export default memo(NavSectionMini);
