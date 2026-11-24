# Mac Toolbox website

The public site for [Mac Toolbox](https://github.com/stozo04/Mac-Toolbox), the open-source toolkit for your Mac. It shows what the app does today and how to help build the rest.

The app itself lives in [stozo04/Mac-Toolbox](https://github.com/stozo04/Mac-Toolbox). Bugs and ideas for the app go there.

## Run it

Needs Node 22.23 or later.

```
npm install
npm run dev
```

## Checks

CI runs the same five on every pull request.

```
npm run lint
npm run format:check
npm run check
npm test
npm run build
```

## The tool list

`src/data/tools.json` is generated from the latest release of the app: its catalog (`ToolCatalog.swift`), the switch that says which tools are built (`ToolInput.isImplemented` in `Tool.swift`) and its version (`ReleaseNotes.swift`). The site describes what the Download button gives you, not what is on the app's `main` branch.

```
npm run sync-tools                          # read the app's latest release on GitHub
npm run sync-tools -- --from ../Mac-Toolbox # read a local checkout instead
npm run sync-tools:check                    # fail if the file is behind the app
```

The "Tool list in sync" workflow runs the check every Monday and on pull requests that touch the script, and fails when a newer release is out.

## Screenshots

Every image in `src/assets/shots/` is a window capture of the real app (1200 x 760) using sample files. Never use a mock-up, and keep personal files, folder names and network names out of frame.

## Deploys

Vercel builds a preview for every pull request and deploys production from `main`.

## License

[MIT](LICENSE)
