import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import GlassPanel, { detectBackdropUrl } from '../../glass-panel';

describe('detectBackdropUrl', () => {
  const originalCSS = global.CSS;

  afterEach(() => {
    global.CSS = originalCSS;
  });

  it('returns true when the browser reports support for backdrop url filters', () => {
    global.CSS = {
      supports: vi.fn((prop: string, value: string) => prop.includes('backdrop-filter') && value.includes('url')),
    } as any;
    expect(detectBackdropUrl()).toBe(true);
  });

  it('falls back to false when CSS.supports is unavailable', () => {
    global.CSS = undefined as any;
    expect(detectBackdropUrl()).toBe(false);
  });
});

describe('GlassPanel', () => {
  const originalCSS = global.CSS;

  beforeEach(() => {
    global.CSS = {
      supports: vi.fn((prop: string, value: string) => prop.includes('backdrop-filter') && value.includes('url')),
    } as any;
  });

  afterEach(() => {
    global.CSS = originalCSS;
  });

  it('enables the Safari-specific backdrop url when supported', async () => {
    render(<GlassPanel data-testid="glass-panel">content</GlassPanel>);

    await waitFor(() => {
      const el = screen.getByTestId('glass-panel');
      expect(el.dataset.hasBackdrop).toBe('true');
    });
  });
});
