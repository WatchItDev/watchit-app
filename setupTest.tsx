import * as matchers from '@testing-library/jest-dom/matchers';
import {afterEach, beforeAll, expect, vi} from 'vitest';
import {cleanup} from "@testing-library/react";

expect.extend(matchers);

// Test Hooks
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
})

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

vi.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }
}));

// @ts-ignore
window.matchMedia = window.matchMedia || function() {
  return {
    matches : false,
    addListener : function() {},
    removeListener: function() {}
  };
};
