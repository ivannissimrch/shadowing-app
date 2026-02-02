import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://08911fed740bb799cc01d6201db9201f@o4510629644140544.ingest.us.sentry.io/4510629645647872",
  tracesSampleRate: 1,
  enableLogs: true,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  sendDefaultPii: true,
});
