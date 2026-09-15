# Customer website on Vercel

Create or configure a Vercel project for the customer app, rather than the workspace root. Keep the admin app in its own deployment project.

## Project settings

In Vercel → Project → Settings → Build and Deployment:

| Setting | Value |
| --- | --- |
| Root Directory | `clusteer-unified/apps/customer` |
| Include source files outside the Root Directory in the Build Step | Enabled |
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

The app-level `vercel.json` supplies the framework, install, build and output settings. The root directory must be selected in Vercel project settings; it is not a supported `vercel.json` property. Workspace dependencies and the lockfile live above the customer app, so files outside its root must be available.

For the redesign preview, deploy `codex/mercury-inspired-design-revamp`. No merge to `main` is needed. After changing the root, use a deployment of the commit containing `apps/customer/vercel.json`. Keep the project's existing production branch selection.

## Why the previous deployment failed

The supplied log for `d9dfad5` showed both apps compiling and completing static generation. The workspace build writes `apps/customer/.next` and `apps/admin/.next`. Vercel then looked for `.next` directly under `clusteer-unified`, where no Next application was built.

Selecting the actual customer app root aligns the Next.js adapter with its build output, configuration and `public` assets. Changing only the output directory at the workspace root would leave the adapter using the workspace's public directory.

## Server runtime packaging

Vercel resolves Next's `relativeAppDir` from the Git repository root. The customer config therefore uses that same root for `outputFileTracingRoot` when Vercel sets `VERCEL=1`. The generated path must be `clusteer-unified/apps/customer`, not `apps/customer`; otherwise the adapter looks for Next's server runtime in a nonexistent folder after the build succeeds.

Firebase App Hosting and local builds keep the tracing root at `clusteer-unified`, preserving Firebase's expected standalone bundle structure. Turbopack uses the same root as file tracing in each environment, as required by Next.js 16.

## Separate runtime configuration

The missing `SPRING_BOOT_API_KEY` warning did not cause this build failure. Backend-backed routes still require their server-side configuration in the appropriate Vercel environment. Set credentials through Vercel's environment settings, never in this file or a public `NEXT_PUBLIC_*` variable. The shared root `turbo.json` also uses an explicit environment allowlist; this customer deployment runs its own `next build` directly.

Dependency deprecations, audit notices and the submodule fetch warning were not the fatal error in this log. The customer app built successfully without those submodules.
