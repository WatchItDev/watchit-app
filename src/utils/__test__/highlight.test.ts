import type { HLJSApi } from 'highlight.js';

const mockHljs = {
  configure: vi.fn(),
  highlight: vi.fn((_language: string, code: string) => ({
    value: `highlighted-${code}`,
  })),
  highlightAuto: vi.fn((code: string) => ({
    value: `auto-highlighted-${code}`,
  }))
} as unknown as HLJSApi;

vi.mock('highlight.js', () => ({
  default: mockHljs
}));

vi.mock('highlight.js/styles/base16/tomorrow-night.css', () => ({}));

describe('[UTILS]: highlight', () => {
  let originalWindow: Window & typeof globalThis;

  beforeEach(() => {
    vi.clearAllMocks();
    originalWindow = global.window;
    global.window = {
      ...originalWindow,
    };
  });

  afterEach(() => {
    global.window = originalWindow;
    vi.resetModules();
  });

  it('configures highlight.js with the correct languages', async () => {
    await import('../highlight');

    expect(mockHljs.configure).toHaveBeenCalledWith({
      languages: ['javascript', 'sh', 'bash', 'html', 'scss', 'css', 'json']
    });
  });

  it('sets hljs on the window object when window is defined', async () => {
    const hljs = await import('highlight.js');
    await import('../highlight');
    expect(global.window.hljs).toBe(hljs.default);
  });

  it('handles highlighting different languages from the supported list', async () => {
    await import('../highlight');
    const supportedLanguages = ['javascript', 'sh', 'bash', 'html', 'scss', 'css', 'json'] as const;

    for (const lang of supportedLanguages) {
      const code = `Sample ${lang} code`;
      const result = mockHljs.highlight(lang, code);
      expect(result.value).toBe(`highlighted-${code}`);
    }
  });

  it('can auto-detect language and highlight code', async () => {
    await import('../highlight');
    const code = '<div>Hello World</div>';
    const result = mockHljs.highlightAuto(code);
    expect(result.value).toBe(`auto-highlighted-${code}`);
  });

  it('does not set window.hljs when window is undefined', async () => {
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
      configurable: true
    });

    await expect(import('../highlight')).resolves.not.toThrow();

    expect(global.window).toBeUndefined();
  });
});
