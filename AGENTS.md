# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Overview

Marketing/landing site for **Ursaworks**, the RoboMaster team at Washington University in St. Louis. React SPA (Vite) with client-side routing (`react-router-dom`), deployed to GitHub Pages on a custom domain. Content (mission text, robots, events) is data-driven from a JSON file plus image assets.

## Layout

All code lives in `react-ursaworks/` — the React app. **Run all npm commands from inside `react-ursaworks/`.**

## Commands

Run from `react-ursaworks/`:

```bash
npm install        # installs deps
npm run dev        # start Vite dev server (http://localhost:3000)
npm start          # alias of dev
npm run build      # Vite production build into build/
npm run preview    # serve the built build/ folder locally (http://localhost:4173)
npm run deploy     # build + publish build/ to GitHub Pages (gh-pages)
npm test           # Vitest (watch mode); add -- --run for a single pass
npm test -- --run src/App.test.jsx   # run one test file once
npm run lint       # ESLint (flat config)
```

## Content data

**`src/content.json` is the source of truth for all text** (mission `intro`, `robots[]`, `events[]`, `team[]`, `aboutImage`). Edit it directly and commit it — it is imported straight into components (`import content from "../content.json"`).

**Images live in `src/assets/<category>/`** (`about/`, `events/`, `members/`, `robots/`, plus `blog/` for posts) and are edited there directly — there is no sync step or separate content folder. Each robot/event/member entry references an image by filename (e.g. `"image": "hero.png"`); the matching file must exist in the corresponding `src/assets/<category>/` folder (`src/__tests__/contentImages.test.js` checks this). Components resolve these at runtime via `configs/loadImages.js`, which uses `import.meta.glob` over `src/assets/**`. UI icons in `src/assets/logoItems/` are imported directly by components.

## App structure

`App.jsx` → `configs/GlobalController.jsx` sets up the router. `GlobalController` renders a `<BrowserRouter>` with a `ScrollToTop` helper (resets scroll on navigation) and a `components/Layout.jsx` parent route that provides the shared chrome — `Navbar`, `Footer`, the `bgAnimation` grid, and an `<Outlet/>`. Child routes:

- `/` → `pages/Home.jsx` (renders `Hero`; owns the scroll-linked hero fade via `IntersectionObserver`)
- `/about` → `pages/AboutPage.jsx` (`components/About`)
- `/events` → `pages/EventsPage.jsx` (`components/Event`)
- `/robots` → `pages/RobotsPage.jsx` (`components/Robots`)
- `*` → redirect to `/`

`Navbar` uses `NavLink` for active-tab highlighting (route-driven, not scroll-driven) and links the logo home. The three content pages (`About`, `Event`, `Robots`) share a `.infoBlock` container and are aligned to a uniform `padding-top: 10rem` so their section titles sit at the same height below the fixed navbar. Each component pairs with a stylesheet in `src/styles/`.

`src/configs/loadImages.js` resolves images via Vite's `import.meta.glob` (not webpack `require.context`).

**GitHub Pages routing:** clean paths require `base: '/'` in `vite.config.mjs` (site is served at the custom-domain root, see `public/CNAME`) plus a `public/404.html` SPA-redirect shim and a companion restore snippet in `index.html`. The 404 shim only activates on live Pages — local `dev`/`preview` have their own SPA fallback.

**Dormant code — not wired into the app:** `components/Team.jsx` (has no route). Don't assume it runs; check `GlobalController.jsx` for what's actually routed. (`screens/Main.jsx`, the old single-page composition, was removed in the routing refactor; the unused `screens/Management.jsx` admin panel and `apis/apiFunctions.js` were removed later.)
