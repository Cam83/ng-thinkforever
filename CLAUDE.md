# CLAUDE.md

## Project Overview

**Float** — a resource management platform for creative agencies. Built as a single-page Next.js application with a custom inline styling system (no Tailwind in page.tsx).

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Inline styles with a custom theme system in `app/page.tsx`; Tailwind CSS + shadcn/ui for components in `components/ui/`
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **Analytics**: Vercel Analytics
- **Package manager**: pnpm (use `pnpm` for installs)

## Key Files

- `app/page.tsx` — main application UI, single large client component with all logic
- `app/layout.tsx` — root layout with metadata and Vercel Analytics
- `app/globals.css` — global styles
- `components/ui/` — shadcn/ui component library
- `components.json` — shadcn/ui config

## Theme System

`page.tsx` uses a custom dual-theme system (dark/light) with inline styles:
- `darkTheme` and `lightTheme` objects define all color tokens
- `getStyles(theme)` returns an object of style definitions
- `getGlobalStyles(theme)` injects a `<style>` tag for scrollbars, body, etc.
- Theme is toggled via `useState` and applied throughout the component

## Dev Commands

```bash
pnpm dev       # start dev server
pnpm build     # production build
pnpm lint      # run ESLint
```

## Conventions

- All UI in `page.tsx` uses inline styles — do NOT introduce Tailwind classes there
- Keep theme-sensitive styles tied to the theme objects; never hardcode colors
- The app is a single-page client component (`"use client"`) — no server components in `page.tsx`
- shadcn/ui components live in `components/ui/` and use Tailwind + CSS variables
- Never use `textTransform: "uppercase"` — all UI text should be written in natural case

## Component Sync Rule

Whenever a component in `components/ui/` is created or edited, it must be reflected in **both**:
1. `app/page.tsx` — where it is used in the live app
2. `app/components/page.tsx` — where it is showcased in the component gallery

Always verify both usages are consistent after any component change.
