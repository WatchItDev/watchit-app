import * as matchers from '@testing-library/jest-dom/matchers';
import {afterEach, expect, vi} from 'vitest';
import {cleanup} from "@testing-library/react";

expect.extend(matchers);

// Test Hooks
afterEach(() => {
  cleanup();
})

// Mocks
vi.mock('react-i18next');
// Iconify mock
vi.mock('@src/components/iconify', () => ({
  __esModule: true,
  default: ({ icon, sx, ...props }: { icon: string, sx?: object }) => (
    <span data-testid="iconify" data-icon={icon} data-sx={JSON.stringify(sx)} {...props} />
  )
}));

// @ts-ignore
window.matchMedia = window.matchMedia || function() {
  return {
    matches : false,
    addListener : function() {},
    removeListener: function() {}
  };
};
