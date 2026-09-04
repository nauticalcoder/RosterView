This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `app/` (project root, not `src/app/`). Every file there is a screen; `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils, models, services) outside `app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Do **not** import from `@react-navigation/*` in application code. Use `expo-router` and `expo-router/react-navigation`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `npx eas-cli@latest <command>`; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

---

## Roster View — project context

Roster View is a mobile college-football roster app, rewritten from an older NativeScript app to Expo + a Node.js API. Sideline staff pick a home team and a visiting team, then browse each roster (number, position, name, class).

### Product intent (from `readme.md` and current UI)

- Three tabs: home team roster, visiting team roster, and Settings.
- Team picker modal (gear icon) and the Settings tab to choose which teams are shown.
- Settings dropdowns currently load hardcoded team names from `assets/ncaa-football-teams.json` (not the API).
- Selected home and visiting teams live in `context/SelectedTeams.tsx` and drive the first two tab titles.
- Team selections persist in `expo-sqlite/kv-store` (web uses `localStorage` via `utils/teamSelectionStorage.web.ts`).
- Settings **Refresh Rosters** fetches ESPN roster data for the selected home and visiting teams (`services/espnRoster.ts`) and stores players plus `updatedAt` in `utils/rosterStorage.ts`.
- Roster rows display Name, Pos, Ht, Wt, Class, and Birthplace.

### Layout

```
app/                    Expo Router screens (file-based)
  _layout.tsx           Root stack, QueryClient, theme, splash, HTTP setup
  (tabs)/               Home + visiting roster tabs
  teamPickerModal.tsx   Team picker (modal)
  modal.tsx             Unused leftover picker screen
api/                    TanStack Query hooks (`useTeamList`, `useApiError`)
components/             PlayerList, Themed wrappers, leftover template bits
constants/              Colors, API base URL
models/                 Team, Player, Conference types
services/               toast + unused handleApiError
utils/                  HTTP client setup, SQLite helper, and team selection storage
types/                  API error shapes
```

### Stack

- Expo SDK 57, React Native 0.86, React 19, Expo Router, TypeScript strict
- TanStack Query v5 for server state
- `@truefit/http-utils` (Axios wrapper) for HTTP
- `expo-sqlite` for the planned local cache (API is async; do not use the removed `openDatabase` / `transaction` API)
- `@react-native-picker/picker` for team selection
- `@expo/vector-icons` (FontAwesome / MaterialCommunityIcons)

### Known gaps (do not treat as finished features)

These are still true unless a later change explicitly completed them:

- `models/Conference.ts` looks like a Team type, not a conference.
- The leftover team picker modal Select/Cancel still do nothing; Settings is the working team picker.
- SQLite `utils/db.ts` is unused; roster cache uses the kv-store helpers instead.
- API URL is hardcoded to localhost. `app.json` `extra.apiUrl` is empty and unused.
- `app/modal.tsx` is leftover and not in the root Stack.
- Template leftovers: `EditScreenInfo`, `ExternalLink` (only used by EditScreenInfo), large commented blocks.

### Conventions for this repo

- Path alias `@/*` maps to the project root (`tsconfig.json`).
- Keep QueryClient at module scope (never construct it inside a React component body).
- Use `npx expo install` for any Expo or React Native-related package.
- New Architecture is mandatory on this SDK. Do not add libraries that only support the old architecture.
- Prefer extending existing `api/` hooks and `models/` types over introducing a new data layer.
- Do not reintroduce `@react-navigation/*` imports or `expo-router/babel`.
