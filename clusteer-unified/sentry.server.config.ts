// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment and release tracking
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE || "clusteer@unknown",

  // Server-specific integrations
  integrations: [
    Sentry.prismaIntegration(), // If using Prisma
    Sentry.postgresIntegration(), // PostgreSQL monitoring
  ],

  // Filter out sensitive information
  beforeSend(event, hint) {
    // Don't send events if DSN is not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Remove sensitive data from request
    if (event.request) {
      delete event.request.cookies;

      // Mask sensitive headers
      if (event.request.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
        delete event.request.headers['x-api-key'];
      }
    }

    // Mask sensitive data in extra context
    if (event.extra) {
      if (event.extra.body && typeof event.extra.body === 'object') {
        const body = event.extra.body as Record<string, unknown>;
        if (body.password) body.password = '[Filtered]';
        if (body.privateKey) body.privateKey = '[Filtered]';
        if (body.token) body.token = '[Filtered]';
        if (body.secret) body.secret = '[Filtered]';
      }
    }

    return event;
  },

  // Ignore certain errors
  ignoreErrors: [
    // Database connection errors (temporary issues)
    'connect ECONNREFUSED',
    'getaddrinfo ENOTFOUND',
    // Rate limiting (expected behavior)
    'Too many requests',
    // Invalid tokens (security, not errors)
    'Invalid token',
    'Unauthorized',
  ],
});
