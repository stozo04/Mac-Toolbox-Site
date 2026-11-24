# AGENTS.md

The marketing site for Mac Toolbox, a native macOS app whose code is in `stozo04/Mac-Toolbox`. Astro, static output, no client-side framework, deployed by Vercel from `main`.

## Code map

- `src/pages/index.astro` - the one page. `src/components/ToolList.astro` - the list of every tool.
- `src/data/site.ts` - names, links and the counts derived from `src/data/tools.json`.
- `src/data/tools.json` - generated; never edit by hand. `scripts/sync-tools.mjs` writes it from the app's latest release, `scripts/catalog.mjs` parses the app's Swift catalog and `ToolInput.isImplemented`, `tests/catalog.test.mjs` covers the parser.
- `src/styles/site.css` - all styles; colors are the custom properties on `:root`, with a light scheme.
- `src/assets/shots/` - window captures of the real app.

## Rules

- Every claim about the app must be true of the app today. Counts come from `tools.json`; never type a number of tools into copy.
- Privacy wording must match what the app's code does (the "Rules" section of the app's AGENTS.md is the reference). Do not write "nothing leaves your Mac" or "nothing is uploaded": the installed app reports its own errors, and the privacy panel lists every feature that uses the internet.
- Screenshots are real captures with sample files, never mock-ups, with no personal data in frame.
- The app is not notarized. Keep the "Opening it the first time" steps accurate for current macOS.
- Run `npm run lint`, `npm run format:check`, `npm run check`, `npm test` and `npm run build` before opening a pull request.
- Astro docs: https://docs.astro.build
