import './init.js';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

import * as Sentry from '@sentry/react';
import App from './App';
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;
window.global = window;

const isDevelopment = GLOBAL_CONSTANTS.ENVIRONMENT === 'development';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Sentry.init({
  environment: GLOBAL_CONSTANTS.ENVIRONMENT,
  enabled: !isDevelopment,
  dsn: GLOBAL_CONSTANTS.SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  tracePropagationTargets: ["localhost", /^https:\/\/app.watchit\.movie/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});



root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);
