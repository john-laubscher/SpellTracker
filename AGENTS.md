# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

D&D Spell Tracker — a React 17 (Create React App) frontend with a lightweight Express.js backend that proxies spell data from the public D&D 5e API (`dnd5eapi.co`).

The backend also includes basic auth + per-user custom spell persistence (currently file-backed for dev; see “Custom spells” below).

### Case-sensitivity workaround (Linux)

The repo was developed on a case-insensitive filesystem (macOS/Windows). On Linux, two symlinks are required before the app can build or run:

```
ln -sf mainUI src/components/MainUI
ln -sf index.js src/components/mainUI/Index.js
```

The update script handles this automatically. If you see `Module not found` errors referencing `MainUI` or `Index`, these symlinks are missing.

### Symlinks on Windows/macOS

- The repo contains symlink entries (`src/components/MainUI` and `src/components/mainUI/Index.js`). On Windows, git may not be able to create symlinks unless Developer Mode is enabled and/or the process is elevated.
- Prefer not to “fix” `MainUI`/`mainUI` issues by deleting or renaming one of the paths: on case-insensitive filesystems, changing/removing one can affect the other.
- If these paths get into a bad state, restoring from git usually fixes it: `git checkout -- src/components/mainUI src/components/MainUI`

### Running the application

Two processes are needed:

| Service | Command | Port |
|---|---|---|
| Express API proxy | `node server/server.js` | 3001 |
| React dev server | `BROWSER=none npm start` | 3000 |

Start the Express server first. The React dev server hot-reloads on file changes.

### Custom spells (auth + persistence)

The backend supports per-user custom spells with CRUD endpoints:

- Auth:
  - `POST /auth/register` `{ email, password }` → `{ token, user }`
  - `POST /auth/login` `{ email, password }` → `{ token, user }`
  - `GET /auth/me` (Bearer token) → `{ user }`
- Custom spells:
  - `GET /custom-spells?level=<0..9>` (Bearer token)
  - `POST /custom-spells` (Bearer token)
  - `PUT /custom-spells/:id` (Bearer token)
  - `DELETE /custom-spells/:id` (Bearer token)

Dev persistence is stored in `server/data/store.json` (gitignored). For production, replace with a real DB (SQLite/Postgres) and set a strong JWT secret via `SPELLTRACKER_JWT_SECRET`.

Frontend auth is stored in localStorage:

- `spelltracker_token`
- `spelltracker_user`

### Lint / Test / Build

- **Lint:** `npx eslint src/` — 14 pre-existing warnings (no errors)
- **Test:** `CI=true npm test -- --watchAll=false` — the single default CRA test fails due to pre-existing issues (axios v1 ESM incompatibility with Jest, and the test asserts text not present in the app). This is not an environment problem.
- **Build:** `npm run build` — compiles with warnings only (same lint warnings)

### External dependency

The Express backend proxies requests to `https://www.dnd5eapi.co`. Internet connectivity is required for spell data to load.
