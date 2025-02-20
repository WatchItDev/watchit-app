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

// @ts-ignore
window.matchMedia = window.matchMedia || function() {
  return {
    matches : false,
    addListener : function() {},
    removeListener: function() {}
  };
};
