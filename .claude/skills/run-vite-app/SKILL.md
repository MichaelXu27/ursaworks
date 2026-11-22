---
name: run-vite-app
description: Use this whenever the user wants to run, start, build, preview, lint, or test the Ursaworks Vite app in this repo — e.g. "start the dev server", "check if it builds", "run the tests", "preview the production build", or after making a code change when you need to see it working. All npm commands run from react-ursaworks/, so use this skill instead of guessing commands or running from the repo root.
---

# Running the Ursaworks Vite app

This is a single-page React site built with Vite. All commands run from
`react-ursaworks/`, not the repo root — `cd` there first (or prefix every
command with `cd react-ursaworks &&`).

## First: make sure you're on the latest main

Before building, previewing, or verifying anything, confirm you're testing
current code — not a stale checkout that never pulled main. A green build on
an out-of-date tree tells you nothing.

```bash
git fetch origin
git status -sb                       # shows "ahead/behind" vs the upstream branch
```

- **On `react-ursaworks` (main):** if it's behind origin, `git pull --ff-only`
  before building. If `--ff-only` fails, the branch has diverged — stop and ask
  rather than force-updating.
- **On a feature branch:** check it isn't behind `origin/react-ursaworks`
  (`git log --oneline HEAD..origin/react-ursaworks`). If main has moved on,
  merge/rebase it in first so you're building against the same code that will
  ship, then continue.

If there's uncommitted work that a pull/checkout would clobber, stop and ask
how to handle it — don't stash or discard on your own.

## Starting the dev server

```bash
npm run dev     # or: npm start
```

Serves at **http://localhost:3000**. This is a long-running process that
blocks the terminal — run it with `run_in_background: true` (or equivalent)
so you can keep working, then check the output log for the "ready in Xms"
/ local URL line to confirm it started. Watch for a port-in-use error,
which means a previous dev server is still running — find and stop that
process rather than assuming the new one took over.

Once it's up, treat this as the moment to actually verify a change: open
the URL in a browser (or however this environment inspects a running
site) and look at the affected part of the page, not just the terminal
output.

## Building for production

```bash
npm run build
```

Runs the Vite production build into `build/`. Use this
to confirm a change doesn't break the production bundle (e.g. after
touching `vite.config.js`, imports, or anything that behaves differently
between dev and prod).

## Previewing the production build

```bash
npm run preview
```

Serves the already-built `build/` folder at **http://localhost:4173**.
Run `npm run build` first if `build/` is stale or missing. Like `dev`,
this is long-running — background it and check the confirmation line.

## Tests and linting

```bash
npm test                              # Vitest in watch mode
npm test -- --run                     # single pass, exits when done
npm test -- --run src/App.test.jsx    # one file, single pass
npm run lint                          # ESLint (flat config)
```

Prefer `npm test -- --run` over plain `npm test` when checking something
programmatically — the watch-mode default will hang waiting for file
changes instead of exiting.

## Deploying

`npm run deploy` builds whatever is currently checked out and publishes it
to the live GitHub Pages site via `gh-pages` — a public, hard-to-reverse
action. **Confirm with the user before running it**; don't run it as part
of a "let's see if this works" check.

Once confirmed, deploy from the main branch (`react-ursaworks`), not a
feature branch, and make sure it's up to date first:

```bash
git status --short           # make sure there's nothing uncommitted to lose
git checkout react-ursaworks
git pull --ff-only
cd react-ursaworks && npm run deploy
```

If `git checkout` would clobber uncommitted work, stop and ask the user
how to handle it rather than stashing/discarding on your own. If
`--ff-only` fails, the local branch has diverged — stop and ask rather
than force-updating it.

## Common mistakes to avoid

- Running `npm run dev`/`build` from the repo root instead of
  `react-ursaworks/` — there's no `package.json` at the root.
- Foreground-running `dev`/`preview` and then waiting — they never exit on
  their own; background them.
