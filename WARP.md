# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

Monorepo for **Post Planner**, an AI-powered social media content planner with:
- `next-app/`: Next.js 16 (App Router) web app.
- `mobile-app/`: React Native + Expo mobile app.
- Root `package.json`: convenience scripts for the Next.js app and Convex backend tooling.

The web and mobile apps share concepts (content types, subscription tiers, AI endpoints) and talk to the same Next.js API surface. Convex is used as an optional real-time/backend layer; its generated client code lives under `next-app/convex/_generated/`.

## Commands & Workflows

### Root-level commands (run from repo root)

```bash
# Start Next.js dev server (proxied to next-app)
npm run dev

# Build Next.js app
npm run build

# Convex local dev (if using Convex backend)
npm run convex:dev

# Convex deploy
npm run convex:deploy
```

These root scripts simply forward to `next-app` or Convex tooling; for most day-to-day web work you can `cd next-app` and use the app-local scripts below.

### Web app (Next.js, in `next-app/`)

From `next-app/`:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build and start in production mode
npm run build
npm start

# Lint (ESLint with Next.js config)
npm run lint

# Unit/integration tests (Vitest)
npm run test          # single run
npm run test:watch    # watch mode
npm run test:coverage # with coverage
npm run test:ui       # Vitest UI

# E2E tests (Playwright)
# First time only:
npx playwright install

npm run test:e2e        # headless
npm run test:e2e:ui     # with Playwright UI
npm run test:e2e:headed # headed browser

# Run all automated tests (unit+E2E)
npm run test:all
```

To run a **single test file** with Vitest, pass a path or pattern, e.g.:

```bash
npm run test -- tests/unit/my-module.test.ts
```

Vitest is configured via `vitest.config.ts` to:
- Use `jsdom` and `tests/setup.ts`.
- Treat `@/` as an alias for `src/`.

### Mobile app (Expo, in `mobile-app/`)

From `mobile-app/`:

```bash
# Install dependencies
npm install

# Start Expo dev server (Metro bundler)
npm start

# Run on iOS simulator (macOS)
npm run ios

# Run on Android emulator
npm run android

# Web preview
npm run web

# Lint mobile codebase
npm run lint

# Build binaries via EAS
npm run build:ios
npm run build:android
```

The mobile app expects environment variables (see `mobile-app/README.md`) including:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_API_BASE_URL` (pointing at the Next.js backend, usually your machine's LAN IP on port 3000 during dev).

## High-level Architecture

### Web app (`next-app/`)

**Framework & entry points**
- Next.js 16 using the **App Router** under `src/app/`.
- `src/app/layout.tsx` is the root layout:
  - Sets SEO metadata and OpenGraph/Twitter meta using `NEXT_PUBLIC_APP_URL`.
  - Loads global fonts and `globals.css`.
  - Wraps the tree with:
    - `SentryInit` (error reporting),
    - `ErrorBoundary` (client-side error containment + Sentry integration),
    - `WebVitals` (web performance metrics to `/api/analytics/vitals` + optional GA),
    - `ConvexClientProvider` (Clerk + optional Convex React client, using `NEXT_PUBLIC_CONVEX_URL`).

**Main UI surface**
- `src/app/page.tsx` is the primary planner UI (`SocialMediaAgent` component):
  - Client component managing all content categories (recipes, workouts, real estate, mindfulness, travel, tech, finance, beauty, parenting, business, lifestyle, educational, motivational) plus custom categories.
  - Coordinates multiple feature tabs (`dashboard`, `content`, `calendar`, `day planner`, presets, etc.) via internal `activeTab` state.
  - Uses dynamic imports for heavy feature components to keep initial bundle smaller:
    - `WeeklyPresetsManager`, `ContentManager`, `CalendarComponent`, `DayPlannerView` from `src/components`.
  - Manages AI generation state (weekly generation, tone changes, Canva design hooks), scheduling state, and category/topic configuration.
  - Uses `NEXT_PUBLIC_API_BASE_URL` (or empty string in dev) as the base for calling Next.js API routes from the browser.

**API layer (`src/app/api/`)**

Organized by domain, each folder exposes a `route.ts` implementing Next.js Request/Response handlers:
- `api/ai/`:
  - Index `route.ts` returns a list of AI-related endpoints.
  - Child routes implement AI operations (as described in the READMEs):
    - `/api/ai/generate`
    - `/api/ai/variation`
    - `/api/ai/improve`
    - `/api/ai/hashtags`
    - `/api/ai/generate-week`
    - `/api/ai/image-recommendations`
    - `/api/ai/trending`
- `api/schedule/`:
  - `/generate-week` (example in `src/app/api/schedule/generate-week/route.ts`):
    - Uses `requireAuth` from `src/lib/auth` (Clerk server SDK) to enforce authentication.
    - Builds a week plan from `getWeekSchedule` in `src/lib/contentSchedule`.
    - For each scheduled item, calls `generatePost` (from `src/lib/postGenerator`) with the corresponding `contentData` slice.
    - Returns a structured result via `successResponse`/`errorResponse` helpers.
  - `/generate-day`, `/weekly`, `/day/[dayName]` implement more granular scheduling endpoints.
- `api/canva/`: Canva-related operations (`create`, `autofill`, `batch`, `templates`).
- `api/stripe/`: Billing endpoints (`checkout`, `portal`, `webhook`).
- `api/analytics/`: `track` events and `vitals` (performance metrics) endpoints.
- `api/monitoring/` and `api/parse-url/`: health/diagnostic and content parsing utilities.

**Domain libraries (`src/lib/`)**

- `contentSchedule.ts`:
  - Defines `weeklySchedule` with `WeeklyScheduleItem` objects (`day`, `type`, `template`, `source`, `description`).
  - Helpers:
    - `getScheduleForDay(dayName)` – lookup by day.
    - `getScheduleByIndex(index)` – index-based rotation.
    - `getWeekSchedule(startDay)` – rotate the schedule starting from an arbitrary day.
- `templates.ts`:
  - String templates keyed by content type (`quote`, `event`, `insight`, `recipePost`, `fitness`, `sweet`).
  - `getTemplate(name)` returns the matching function (defaults to `quote`).
- `postGenerator.ts`:
  - Connects `contentSchedule` and `templates`.
  - `generatePost(day, data)` selects the schedule, retrieves the template, and renders a caption; falls back to a generic caption if something fails.
- `contentLibrary.ts`:
  - Curated starter content (e.g., workouts, motivational, educational posts) used by the planner.
- `auth.ts`:
  - `requireAuth()` wrapper around `@clerk/nextjs/server`.
  - Standardizes 401 responses for unauthenticated API calls.
- Other files referenced in the root README include integrations like `firebase.ts` and additional helpers used across the app.

**Infrastructure & cross-cutting concerns**

- `src/components/ConvexClientProvider.tsx`:
  - Creates a `ConvexReactClient` if `NEXT_PUBLIC_CONVEX_URL` is set.
  - Wraps children with `ClerkProvider` and `ConvexProviderWithClerk` (otherwise falls back to `ClerkProvider` only).
- `src/components/WebVitals.tsx`:
  - Uses `useReportWebVitals` to log and forward metrics to Google Analytics (if available) and `/api/analytics/vitals`.
  - Logs additional navigation timing metrics and warns when thresholds are exceeded (e.g., TTFB > 600ms).
- `src/components/ErrorBoundary.tsx`:
  - Standard React error boundary that, when `NEXT_PUBLIC_SENTRY_DSN` is present, forwards exceptions to Sentry.
  - Shows a user-friendly fallback UI, with detailed error info in development.

### Mobile app (`mobile-app/`)

**Routing & layout**

- Uses **Expo Router** with file-based routing under `mobile-app/app/`:
  - `app/_layout.tsx`:
    - Root layout that:
      - Initializes `react-native-gesture-handler` and wraps the app in `GestureHandlerRootView`.
      - Configures `ClerkProvider` with a secure token cache (`expo-secure-store`).
      - Optionally sets up Convex (`convex/react-clerk`) if the Convex client is available and configured.
      - Manages navigation based on auth state via `useSegments` and `useRouter`:
        - Unauthenticated users are pushed into the `(auth)` group (`/ (auth)/sign-in`).
        - Authenticated users are redirected to the `(tabs)` group.
      - Hides the splash screen once Clerk auth state is loaded.
    - All navigation ultimately renders through `RootLayoutNav`, which also wires the `apiClient`’s auth token provider.
  - `app/(auth)/...`:
    - Auth flow screens (sign-in/sign-up) using Clerk.
  - `app/(tabs)/_layout.tsx`:
    - Bottom tab navigator with screens:
      - `index` (Dashboard), `library`, `create`, `schedule`, `presets`, `profile`.
    - Custom emoji-based tab icons and consistent planner-style theming.

**API client & shared types**

- `lib/api-client.ts`:
  - Thin wrapper over `fetch` targeting the web app’s API surface.
  - Base URL from `EXPO_PUBLIC_API_BASE_URL` or Expo config (falls back to `http://localhost:3000`).
  - Attaches Clerk JWT as `Authorization: Bearer <token>` when available.
  - Methods closely mirror Next.js API routes:
    - AI: `generateContent`, `generateWeek`, `improveContent`, `generateVariation`, `generateHashtags`, `getImageRecommendations`.
    - Schedule: `getWeeklySchedule`, `getDaySchedule`, `generateDaySchedule`.
    - Stripe: `createCheckoutSession`, `createPortalSession`.
    - Analytics: `trackEvent` (errors are logged but don’t break the app).
- `lib/content-types.ts`:
  - Type definitions for AI-related requests/responses shared by the mobile caller (platform, tone, content types, image recommendation payloads).
- `lib/subscription-types.ts`:
  - Mirrors the web app’s subscription model:
    - `TIER_LIMITS`, `TIER_PRICES`, `TIER_FEATURES` for tiers (`free`, `starter`, `pro`, `agency`).
    - Helpers like `getTierLimits`, `canUseFeature`, `getUpgradeMessage`, `getTierPrice` used for gating features in the UI.

**TypeScript configuration**

- `mobile-app/tsconfig.json`:
  - Extends `expo/tsconfig.base`.
  - Path aliases:
    - `@/*` → project root (e.g. `@/lib/api-client`).
    - `@shared/*` → `../shared/*` (intended for future shared web/mobile code; the directory may or may not exist yet).

### Convex

- `next-app/convex/_generated/` contains Convex-generated types and client code.
- Do not edit anything in `_generated/` directly; changes should be driven by Convex schema and code in the standard Convex directories (outside `_generated/`).
- Root scripts `convex:dev` and `convex:deploy` are the primary entrypoints for local Convex dev and deployment.

## Testing Layout

All web tests live under `next-app/tests/` (see `tests/README.md` for details):
- `tests/unit/`: isolated unit tests for lib functions/components.
- `tests/integration/`: API routes and service interactions.
- `tests/e2e/`: Playwright tests for end-to-end flows.
- `tests/setup.ts`: global Vitest setup, including environment variable and external service mocking.

Vitest excludes `tests/e2e` (handled by Playwright) and generated/build output directories. Playwright requires browser binaries to be installed via `npx playwright install` before running E2E tests.

## Environment & Auth Notes

- Web app env variables are configured via `.env.local` in `next-app/` (see both repo-level and `next-app/` READMEs). Common ones include:
  - `OPENAI_API_KEY`, `CANVA_API_KEY`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_APP_URL`, and Sentry/Stripe-related keys.
- Many API routes (e.g., schedule generation, billing) depend on **Clerk authentication** via `requireAuth()`; when calling these from tests or tools, either mock Clerk or ensure requests are made with a valid authenticated session.
- The mobile app shares the same backend and expects compatible environment/configuration so that its `apiClient` can reach the Next.js APIs and Stripe/Convex/AI features behave consistently across platforms.
