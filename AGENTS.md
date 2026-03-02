# AGENTS.md

Guidance for AI coding agents working on the Lunex codebase. This file supplements README.md and DEVELOPMENT.md by focusing on context needed for automation (build, test, conventions, PR).

## Project overview

- **Lunex**: Cross-platform desktop AI assistant (Tauri + React + Rust).
- **Frontend**: React 18, TypeScript, Vite, Redux Toolkit, Tailwind/shadcn, i18next.
- **Backend**: Rust (src-tauri), SQLite, MCP (Model Context Protocol), Tauri commands.
- **Main structure**:
  - `src/` — UI: `app/`, `features/`, `hooks/`, `lib/`, `ui/` (atoms from shadcn), `bindings/` (Tauri types), `i18n/`.
  - `src-tauri/` — Rust: commands, MCP, DB, build.

## Dev environment

- **Node**: v18+ (LTS recommended). **Package manager**: Yarn.
- **Rust**: stable (rustup).
- **macOS**: Xcode Command Line Tools. **Linux**: webkit2gtk, libappindicator, librsvg (see DEVELOPMENT.md). **Windows**: VS C++ Build Tools, WebView2.
- Install dependencies: `yarn install`; Rust: `cd src-tauri && cargo check`.
- Run app: `yarn dev` (generates bindings + `tauri dev`). First Rust build may take a few minutes.
- When changing Tauri commands or structs used in the API → **must** run `yarn gen:bindings` to update TypeScript types (before `yarn dev` or `yarn build`).

## Build

- **Production**: `yarn build` (= `yarn gen:bindings && tauri build`). Output: `src-tauri/target/release/bundle/`.
- **UI only (Vite)**: `yarn ui:build` (= `tsc && vite build`).
- **Bindings**: `yarn gen:bindings` (runs a Rust test to generate TypeScript files in `src/bindings`).

## Testing

- **Frontend**: `yarn test` (Vitest). Run a single test: `yarn test -- run -t "<test name>"`. Coverage: `yarn test:coverage`.
- **Rust**: `cd src-tauri && cargo test`.
- Before committing: ensure `yarn typecheck`, `yarn lint`, and `yarn test` pass (and if touching Rust: `cargo test`, `cargo clippy`). Add or update tests when changing logic.

## Code style & conventions

- **TypeScript/React**:
  - Functional components + hooks.
  - Use components from `src/ui/atoms` (shadcn) when possible.
  - Avoid `any`; keep types explicit.
- **Rust**:
  - Idiomatic Rust; proper error handling (avoid `unwrap()` in production code).
  - Use async/await for I/O.
- **Format**: `yarn format` (Prettier); Rust: `yarn format:rust` (cargo fmt). Check: `yarn format:check`, `yarn format:rust:check`.
- **Lint**: `yarn lint` (ESLint), `yarn lint:rust` (clippy). Auto-fix TS: `yarn lint:fix`.

## PR & commit guidelines

- Branch from `main`; use descriptive branch names (e.g. `feature/new-sidebar`, `fix/memory-leak`).
- **Commits**: Conventional Commits — `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Before pushing: run `yarn lint`, `yarn format` (and `yarn test`). If changing Rust: `yarn lint:rust`, `yarn format:rust`, `cargo test`.
- Describe PR in detail; link issues when relevant (e.g. `Fixes #123`).

## Security & docs

- Security issues: see [SECURITY_POLICY.md](./SECURITY_POLICY.md).
- Setup, debugging, cleanup: [DEVELOPMENT.md](./DEVELOPMENT.md). Contribution workflow: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Quick reference — scripts

| Purpose              | Command                            |
| -------------------- | ---------------------------------- |
| Run app              | `yarn dev`                         |
| Production build     | `yarn build`                       |
| Generate Tauri types | `yarn gen:bindings`                |
| Typecheck            | `yarn typecheck`                   |
| Lint (TS)            | `yarn lint` / `yarn lint:fix`      |
| Lint (Rust)          | `yarn lint:rust`                   |
| Format               | `yarn format` / `yarn format:rust` |
| Test (UI)            | `yarn test` / `yarn test:coverage` |
| Test (Rust)          | `cd src-tauri && cargo test`       |
