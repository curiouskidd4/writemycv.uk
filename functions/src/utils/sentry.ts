import * as Sentry from "@sentry/node";
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://9bf38e80c44d6f1b923343de8288926b@o4506826084122624.ingest.us.sentry.io/4507039874547712",
  // integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

interface ExceptionData {
  src?: string;
  message?: string;
  context?: Record<string, any>;
}

const captureException = (error: Error, data: ExceptionData) => {
  Sentry.captureException(error);
  let currentScope = Sentry.getCurrentScope();
  currentScope.setContext("context", data.context as any);
  currentScope.setExtra("message", data.message as string);
  currentScope.setTag("src", data.src as string);
};

export { Sentry, captureException };
