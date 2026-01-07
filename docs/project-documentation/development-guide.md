# Development Guide

**Last Updated:** 2025-01-27

## Prerequisites

### Required Software

- **Node.js**: LTS version (18.x or 20.x recommended)
- **Yarn**: Package manager (install via `npm install -g yarn`)
- **Rust**: Latest stable version (install via [rustup](https://rustup.rs/))
- **Git**: Version control

### Platform-Specific Dependencies

#### macOS

- Xcode Command Line Tools: `xcode-select --install`

#### Linux

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf
```

#### Windows

- WebView2 (usually pre-installed on Windows 10/11)
- Microsoft Visual C++ Build Tools

## Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/Nexo-Agent/nexo.git
cd nexo
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
yarn install

# Rust dependencies are managed by Cargo (installed automatically on build)
```

### 3. Generate TypeScript Bindings

TypeScript bindings are generated from Rust constants:

```bash
yarn gen:bindings
```

This command:

- Runs Rust tests that generate TypeScript types
- Creates `src/bindings/commands.ts` from `src-tauri/src/constants/commands.rs`
- Creates `src/bindings/events.ts` from `src-tauri/src/constants/events.rs`

### 4. Environment Variables

Create `.env` file in project root (optional):

```env
# Sentry (for error tracking in production)
VITE_SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT_FRONTEND=nexo-frontend
SENTRY_AUTH_TOKEN=your-token

# Rust Sentry (set at build time)
RUST_SENTRY_DSN=your-sentry-dsn
```

## Development Workflow

### Running in Development Mode

```bash
yarn tauri:dev
```

This command:

1. Generates TypeScript bindings
2. Starts Vite dev server (frontend)
3. Compiles Rust backend
4. Launches Tauri app with hot reload

**Dev Server:**

- Frontend: `http://localhost:1420`
- HMR: WebSocket on port 1421

### Building for Production

```bash
yarn tauri:build
```

This command:

1. Generates TypeScript bindings
2. Builds frontend with Vite
3. Compiles Rust backend
4. Bundles into native app

**Output Location:**

- macOS: `src-tauri/target/release/bundle/macos/`
- Linux: `src-tauri/target/release/bundle/linux/`
- Windows: `src-tauri/target/release/bundle/msi/`

## Code Organization

### Frontend Structure

```
src/
├── ui/              # UI components (Atomic Design)
├── hooks/           # Custom React hooks
├── store/           # Redux store and slices
├── lib/             # Utility libraries
├── i18n/            # Internationalization
└── ...
```

### Backend Structure

```
src-tauri/src/
├── commands/        # Tauri commands (API layer)
├── services/        # Business logic
├── repositories/    # Data access
├── models/          # Data structures
└── ...
```

## Development Commands

### Frontend Commands

```bash
# Development server (Vite only, no Tauri)
yarn dev

# Type checking
yarn typecheck

# Linting
yarn lint
yarn lint:fix

# Formatting
yarn format
yarn format:check
```

### Backend Commands

```bash
# Rust linting
yarn lint:rust

# Rust formatting
yarn format:rust
yarn format:rust:check

# Run Rust tests
cd src-tauri
cargo test

# Run specific test
cargo test --package nexo --lib constants::tests::generate_typescript_bindings
```

### Documentation Commands

```bash
# Start Docusaurus dev server
yarn docs:dev

# Build documentation
yarn docs:build
```

## TypeScript Configuration

### Path Aliases

TypeScript is configured with path aliases:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage:**

```typescript
import { Button } from '@/ui/atoms/button';
import { useChats } from '@/hooks/useChats';
```

### Type Generation

TypeScript types are generated from Rust:

- **Commands:** `src/bindings/commands.ts` ← `src-tauri/src/constants/commands.rs`
- **Events:** `src/bindings/events.ts` ← `src-tauri/src/constants/events.rs`

**Regenerate after changing Rust constants:**

```bash
yarn gen:bindings
```

## Rust Development

### Project Structure

```
src-tauri/
├── Cargo.toml          # Dependencies
├── tauri.conf.json     # Tauri configuration
├── build.rs            # Build script
└── src/
    ├── lib.rs          # Library entry point
    ├── main.rs         # Application entry point
    └── ...
```

### Adding a New Command

1. **Define command name in constants:**

```rust
// src-tauri/src/constants/commands.rs
impl TauriCommands {
    pub const MY_NEW_COMMAND: &'static str = "my_new_command";
}
```

2. **Implement command handler:**

```rust
// src-tauri/src/commands/my_feature.rs
#[tauri::command]
pub async fn my_new_command(
    app: AppHandle,
    param: String,
) -> Result<Response, AppError> {
    // Implementation
    Ok(response)
}
```

3. **Register command:**

```rust
// src-tauri/src/lib.rs
.invoke_handler(tauri::generate_handler![
    // ... other commands
    commands::my_feature::my_new_command,
])
```

4. **Regenerate TypeScript bindings:**

```bash
yarn gen:bindings
```

5. **Use in frontend:**

```typescript
import { invokeCommand } from '@/lib/tauri';
import { TauriCommands } from '@/bindings/commands';

const result = await invokeCommand(TauriCommands.MY_NEW_COMMAND, {
  param: 'value',
});
```

### Adding a New Event

1. **Define event name in constants:**

```rust
// src-tauri/src/constants/events.rs
impl TauriEvents {
    pub const MY_NEW_EVENT: &'static str = "my-new-event";
}
```

2. **Emit event:**

```rust
// In service or command
use crate::events::MessageEmitter;

let emitter = MessageEmitter::new(app.clone());
emitter.emit_my_new_event(payload).await?;
```

3. **Regenerate TypeScript bindings:**

```bash
yarn gen:bindings
```

4. **Listen in frontend:**

```typescript
import { listen } from '@tauri-apps/api/event';
import { TauriEvents } from '@/bindings/events';

listen(TauriEvents.MY_NEW_EVENT, (event) => {
  console.log('Event received:', event.payload);
});
```

## Database Development

### Migrations

Database migrations are defined in `src-tauri/src/db/migrations.rs`:

```rust
pub fn run_migrations(conn: &Connection) -> Result<()> {
    // Create tables
    conn.execute("CREATE TABLE IF NOT EXISTS ...", [])?;

    // Add columns (for schema evolution)
    conn.execute("ALTER TABLE ... ADD COLUMN ...", []).ok();

    // Create indexes
    conn.execute("CREATE INDEX IF NOT EXISTS ...", [])?;

    Ok(())
}
```

**Migration Strategy:**

- Use `CREATE TABLE IF NOT EXISTS` for new tables
- Use `ALTER TABLE ... ADD COLUMN` with `.ok()` for new columns (ignores if exists)
- Migrations run automatically on app startup

### Database Location

- **Development:** `~/.local/share/com.nexo.app/database.db` (Linux/macOS)
- **Production:** OS app data directory

### Accessing Database

```bash
# Using sqlite3 CLI
sqlite3 ~/.local/share/com.nexo.app/database.db

# View tables
.tables

# View schema
.schema workspaces
```

## Testing

### Frontend Tests

```bash
# Run tests (when test suite is set up)
yarn test

# Watch mode
yarn test:watch
```

### Backend Tests

```bash
cd src-tauri
cargo test

# Run specific test
cargo test test_name

# With output
cargo test -- --nocapture
```

## Debugging

### Frontend Debugging

- **Browser DevTools:** Available in Tauri dev mode
- **React DevTools:** Install browser extension
- **Redux DevTools:** Available in development

### Backend Debugging

- **Rust Debugger:** Use VS Code with rust-analyzer extension
- **Logging:** Use `println!` or `eprintln!` for debug output
- **Sentry:** Error tracking in production

### Tauri DevTools

Tauri includes devtools in development mode. Access via:

- Right-click → Inspect Element
- Or use Tauri's built-in devtools

## Code Style

### TypeScript/JavaScript

- **Linter:** ESLint
- **Formatter:** Prettier
- **Config:** `eslint.config.js`, `.prettierrc`

**Run:**

```bash
yarn lint
yarn format
```

### Rust

- **Formatter:** rustfmt
- **Linter:** Clippy
- **Config:** `rustfmt.toml`, `Cargo.toml` lints section

**Run:**

```bash
yarn format:rust
yarn lint:rust
```

## Common Tasks

### Adding a New UI Component

1. Create component file in appropriate directory (`atoms/`, `molecules/`, `organisms/`)
2. Follow Atomic Design principles
3. Add TypeScript types
4. Export from module
5. Use in parent component

### Adding a New Redux Slice

1. Create slice file in `src/store/slices/`
2. Define state interface
3. Create slice with `createSlice`
4. Export actions and reducer
5. Add to store in `src/store/index.ts`

### Adding a New Service

1. Create service file in `src-tauri/src/services/`
2. Define service struct with dependencies
3. Implement methods
4. Add to `AppState` in `src-tauri/src/state/app_state.rs`
5. Use in commands or other services

## Troubleshooting

### TypeScript Bindings Not Updating

```bash
# Regenerate bindings
yarn gen:bindings

# Check if Rust tests pass
cd src-tauri
cargo test --package nexo --lib constants::tests::generate_typescript_bindings
```

### Database Migration Issues

- Check migration code in `src-tauri/src/db/migrations.rs`
- Verify SQL syntax
- Check for column conflicts

### Build Errors

- **Frontend:** Check Node.js version, clear `node_modules`, reinstall
- **Backend:** Check Rust version, run `cargo clean`, rebuild

### Hot Reload Not Working

- Restart dev server
- Clear browser cache
- Check Vite configuration

## Performance Tips

### Frontend

- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load heavy components
- Optimize bundle size with code splitting

### Backend

- Use database indexes for frequent queries
- Implement connection pooling
- Use async/await for I/O operations
- Profile with `cargo flamegraph`

## Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

_Documentation generated by BMAD Method `document-project` workflow_
