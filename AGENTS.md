# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

D&D Spell Tracker — a React 17 (Create React App) frontend with a lightweight Express.js backend that proxies spell data from the public D&D 5e API (`dnd5eapi.co`). No database.

### Case-sensitivity workaround (Linux)

The repo was developed on a case-insensitive filesystem (macOS/Windows). On Linux, two symlinks are required before the app can build or run:

```
ln -sf mainUI src/components/MainUI
ln -sf index.js src/components/mainUI/Index.js
```

The update script handles this automatically. If you see `Module not found` errors referencing `MainUI` or `Index`, these symlinks are missing.

### Running the application

Two processes are needed:

| Service | Command | Port |
|---|---|---|
| Express API proxy | `node server/server.js` | 3001 |
| React dev server | `BROWSER=none npm start` | 3000 |

Start the Express server first. The React dev server hot-reloads on file changes.

### Lint / Test / Build

- **Lint:** `npx eslint src/` — 14 pre-existing warnings (no errors)
- **Test:** `CI=true npm test -- --watchAll=false` — the single default CRA test fails due to pre-existing issues (axios v1 ESM incompatibility with Jest, and the test asserts text not present in the app). This is not an environment problem.
- **Build:** `npm run build` — compiles with warnings only (same lint warnings)

### External dependency

The Express backend proxies requests to `https://www.dnd5eapi.co`. Internet connectivity is required for spell data to load.
