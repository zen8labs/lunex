---
sidebar_position: 1
---

# Development Setup

This guide will help you set up your development environment for Nexo.

## Prerequisites

### Required Software

- **Node.js**: LTS version (18.x or 20.x recommended)
- **Yarn**: Package manager (install via `npm install -g yarn`)
- **Rust**: Latest stable version (install via [rustup](https://rustup.rs/))
- **Git**: Version control

### Platform-Specific Dependencies

#### macOS

```bash
xcode-select --install
```

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

### 4. Environment Variables (Optional)

Create `.env` file in project root:

```env
# Sentry (for error tracking in production)
VITE_SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT_FRONTEND=nexo-frontend
SENTRY_AUTH_TOKEN=your-token

# Rust Sentry (set at build time)
RUST_SENTRY_DSN=your-sentry-dsn
```

## Running in Development Mode

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

## Building for Production

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

## Troubleshooting

### TypeScript Bindings Not Updating

```bash
# Regenerate bindings
yarn gen:bindings

# Check if Rust tests pass
cd src-tauri
cargo test --package nexo --lib constants::tests::generate_typescript_bindings
```

### Build Errors

- **Frontend:** Check Node.js version, clear `node_modules`, reinstall
- **Backend:** Check Rust version, run `cargo clean`, rebuild

### Hot Reload Not Working

- Restart dev server
- Clear browser cache
- Check Vite configuration
