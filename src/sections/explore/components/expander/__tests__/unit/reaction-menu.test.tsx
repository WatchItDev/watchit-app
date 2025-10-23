import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactionMenu } from '../../../expander/reaction-menu';
import type { MutableRefObject } from 'react';
import type { ReactionValue } from '@src/sections/explore/types';

const iconFactory = (label: string) => (_props: { size?: number }) => <span>{label}</span>;

const OPTIONS = [
  { value: 'love' as ReactionValue, label: 'Love', icon: iconFactory('❤️'), color: '#f06292' },
  { value: 'mega_fan' as ReactionValue, label: 'Mega Fan', icon: iconFactory('⭐'), color: '#ffd600', price: 50 },
];

describe('ReactionMenu', () => {
  it('renders each available reaction and notifies selection', async () => {
    const onSelect = vi.fn();
    const menuRef: MutableRefObject<HTMLDivElement | null> = { current: null };
    render(
      <ReactionMenu
        options={OPTIONS}
        activeReaction={null}
        menuRef={menuRef}
        onSelect={onSelect}
      />,
    );

    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    await user.click(buttons[1]);
    expect(onSelect).toHaveBeenCalledWith('mega_fan');
    expect(menuRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
