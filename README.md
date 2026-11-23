# Cita bajo el mar

A small web app that asks Luana out to dinner at Restaurante Submarino (Oceanogràfic, Valencia). She answers a few questions, confirms the date, and her answers are saved in Supabase. Leo reads them on `/admin`.

Built with React, TypeScript and Vite, React Router, Supabase (database and auth) and SCSS Modules. It deploys to Vercel.

## Getting started

```bash
npm install
```

```bash
cp .env.example .env.local
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` (Supabase dashboard, Project Settings, API). Then start the dev server:

```bash
npm run dev
```

The page works without the env variables too, but confirming shows the error message and `/admin` says Supabase is missing.

## Supabase setup

1. Create a project at supabase.com.
2. Run `supabase/migrations/20261123000000_create_date_responses.sql` in the SQL editor (or `supabase db push` if you use the CLI). It creates the `date_responses` table with Row Level Security: anonymous visitors may only insert, signed in users may only read, and nobody can update or delete through the API.
3. Turn off sign ups: Authentication, Sign In / Providers, untick "Allow new users to sign up". Every signed in user can read the answers, so your account should be the only one.
4. Create your admin account: Authentication, Users, "Add user", with email and password and "Auto confirm user" ticked.

## Deploying to Vercel

Import the GitHub repo in Vercel (it detects Vite on its own), add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under Environment Variables, and deploy. `vercel.json` sends every path to `index.html` so `/admin` works on reload, and tells search engines not to index the site.

## How it is put together

The invitation lives in `src/pages/InvitationPage.tsx`. Each screen is its own component in `src/components/steps/` (IntroStep, QuestionStep, CelebrationStep, DateStep, QuestionsStep, SummaryStep, ConfirmedStep). All screens stay mounted and cross fade with CSS, like the original design.

The flow state (current screen, answers, question number, save status) is one reducer in `src/flow/dateFlow.ts`, used through the `useDateFlow` hook. After she confirms, her answers are kept in localStorage, so reopening the page shows the confirmation screen. On `/admin` there is a link that clears this on the current device.

The answer types (`DateResponse`, `DateResponseInput`, `DateDraft`) are in `src/types/date.ts` and are shared by the form, the service and the admin view. The database stores English codes (`fish`, `dinner`, …) and `src/content/options.ts` holds the Spanish labels and the questions.

Supabase is only touched in `src/lib/supabase.ts` (the client) and `src/services/dateResponses.ts` (insert, select, sign in, sign out).

The runaway "No" button in `QuestionStep.tsx` jumps on mouse hover, on `touchstart` (with a non passive listener, so the tap never lands) and on keyboard activation. Effects (bubbles, confetti) are skipped when the visitor prefers reduced motion.

## Photos

The originals are in `photos-src/`. `npm run photos` resizes them for phones and writes WebP files to `src/assets/photos/`, which is what the app imports.

## Scripts

`npm run dev` starts the dev server, `npm run build` type checks and builds, `npm test` runs the Vitest suite, `npm run lint` runs oxlint and `npm run photos` regenerates the photos.
