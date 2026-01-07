# Nexo Documentation Index

**Type:** Desktop Application (Monolith)  
**Primary Language:** TypeScript (Frontend), Rust (Backend)  
**Architecture:** Local-first, Hybrid (React + Tauri + Rust)  
**Last Updated:** 2025-01-27

## Project Overview

Nexo is a powerful, cross-platform desktop AI assistant built with Tauri, React, and Rust. It provides a seamless interface for interacting with multiple LLM providers while offering advanced features like MCP (Model Context Protocol) integration, workspace management, and extensible tool support.

**Key Features:**

- Multi-LLM support (OpenAI, Anthropic, Google, Ollama, etc.)
- MCP (Model Context Protocol) integration
- Workspace management with workspace-specific settings
- Local-first architecture (all data stored locally)
- Python and Node.js runtime support
- Privacy-focused (no telemetry or data collection)

## Quick Reference

- **Tech Stack:** React 18.3.1 + TypeScript 5.6.2 (Frontend), Rust + Tauri 2.0 (Backend)
- **Entry Point:** `src/main.tsx` (Frontend), `src-tauri/src/main.rs` (Backend)
- **Architecture Pattern:** Layered Architecture (Commands → Services → Repositories)
- **Database:** SQLite (local-first, embedded)
- **Deployment:** macOS (.dmg), Linux (.deb, .AppImage), Windows (.msi)

## Generated Documentation

### Core Documentation

- [Project Overview](./project-overview.md) - Executive summary and high-level architecture
- [Architecture](./architecture.md) - Detailed technical architecture
- [Source Tree Analysis](./source-tree-analysis.md) - Annotated directory structure
- [Component Inventory](./component-inventory.md) - UI component catalog
- [Data Models](./data-models.md) - Database schema and models
- [Development Guide](./development-guide.md) - Setup and development workflow

### Business Documentation

- [Business Documentation](./business-documentation.md) - Business features, value proposition, and user personas
- [User Flows](./user-flows.md) - Detailed user flows and interaction patterns

### Supporting Documentation

- [README.md](../../README.md) - Project README with installation instructions
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines
- [DEVELOPMENT.md](../../DEVELOPMENT.md) - Development documentation

## Existing Documentation

- [.agent/ARCHITECTURE.md](../../.agent/ARCHITECTURE.md) - Architecture overview
- [.agent/PROJECT_STRUCTURE_MAP.md](../../.agent/PROJECT_STRUCTURE_MAP.md) - Project structure map
- [docs/design/](../../docs/design/) - Design documents
- [docs/implementation/](../../docs/implementation/) - Implementation reports

## Getting Started

### Prerequisites

- Node.js (LTS version)
- Yarn package manager
- Rust (latest stable version)
- Platform-specific dependencies (see README.md)

### Setup

```bash
# Clone repository
git clone https://github.com/Nexo-Agent/nexo.git
cd nexo

# Install dependencies
yarn install

# Generate TypeScript bindings
yarn gen:bindings

# Run in development mode
yarn tauri:dev
```

### Build for Production

```bash
yarn tauri:build
```

Built application will be in `src-tauri/target/release/bundle/`.

## For AI-Assisted Development

This documentation was generated specifically to enable AI agents to understand and extend this codebase.

### When Planning New Features:

**UI-only features:**
→ Reference: `architecture.md`, `component-inventory.md`

**Backend/API features:**
→ Reference: `architecture.md`, `data-models.md`, `development-guide.md`

**Full-stack features:**
→ Reference: All architecture docs

**Database changes:**
→ Reference: `data-models.md`, `development-guide.md` (migrations section)

**Component additions:**
→ Reference: `component-inventory.md`, `development-guide.md` (component patterns)

### Key Architecture Concepts:

1. **Layered Architecture:**
   - Commands (API layer) → Services (Business logic) → Repositories (Data access)

2. **Atomic Design:**
   - Atoms (primitives) → Molecules (composed) → Organisms (complex) → Layouts → Screens

3. **State Management:**
   - Redux Toolkit for global state
   - Custom hooks for Tauri API calls
   - Local state for UI-only state

4. **IPC Communication:**
   - Tauri Commands for request/response
   - Tauri Events for streaming and real-time updates

5. **Database:**
   - SQLite with manual migrations
   - Repository pattern for data access
   - Foreign keys with CASCADE deletes

## Documentation Structure

```
docs/project-documentation/
├── index.md                    # This file (master index)
├── project-overview.md         # Executive summary
├── architecture.md             # Detailed architecture
├── source-tree-analysis.md     # Directory structure
├── component-inventory.md      # UI components
├── data-models.md             # Database schema
└── development-guide.md       # Development workflow
```

## Technology Stack Summary

### Frontend

- React 18.3.1
- TypeScript 5.6.2
- Redux Toolkit 2.11.2
- Tailwind CSS 4.1.18
- Vite 6.0.3
- Radix UI components

### Backend

- Tauri 2.0
- Rust (Edition 2021)
- SQLite (rusqlite 0.31)
- reqwest 0.12 (HTTP client)
- rust-mcp-sdk 0.7 (MCP protocol)

### Runtime Support

- Python (Pyodide)
- Node.js

## Project Structure

```
nexo/
├── src/                    # React frontend
│   ├── ui/                 # UI components (Atomic Design)
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Redux store
│   └── lib/                # Utilities
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── commands/       # Tauri commands
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access
│   │   └── models/          # Data structures
│   └── tauri.conf.json      # Tauri config
└── docs/                    # Documentation
```

## Database Schema

**Main Tables:**

- `workspaces` - Workspace management
- `chats` - Chat sessions
- `messages` - Chat messages
- `workspace_settings` - Workspace configurations
- `llm_connections` - LLM provider connections
- `mcp_server_connections` - MCP server connections
- `app_settings` - Application settings
- `prompts` - Custom prompt templates
- `usage_stats` - Token usage tracking

See [Data Models](./data-models.md) for complete schema documentation.

## Development Workflow

1. **Setup:** Install prerequisites, clone repo, install dependencies
2. **Development:** Run `yarn tauri:dev` for hot reload
3. **Type Safety:** Regenerate bindings with `yarn gen:bindings` after Rust changes
4. **Testing:** Run tests with `yarn test` (frontend) or `cargo test` (backend)
5. **Building:** Build with `yarn tauri:build`

See [Development Guide](./development-guide.md) for detailed instructions.

## Key Files

### Frontend Entry Points

- `src/main.tsx` - Frontend entry point
- `src/App.tsx` - Main React component

### Backend Entry Points

- `src-tauri/src/main.rs` - Application entry point
- `src-tauri/src/lib.rs` - Library entry point

### Configuration

- `package.json` - Frontend dependencies
- `src-tauri/Cargo.toml` - Rust dependencies
- `src-tauri/tauri.conf.json` - Tauri configuration
- `tsconfig.json` - TypeScript configuration

### Database

- `src-tauri/src/db/migrations.rs` - Database schema

## Next Steps

1. **Review Architecture:** Read [architecture.md](./architecture.md) to understand system design
2. **Explore Components:** Check [component-inventory.md](./component-inventory.md) for UI structure
3. **Understand Data:** Review [data-models.md](./data-models.md) for database schema
4. **Start Developing:** Follow [development-guide.md](./development-guide.md) for setup

## Additional Resources

- [GitHub Repository](https://github.com/Nexo-Agent/nexo)
- [Website](https://nexo.nkthanh.dev)
- [Issues](https://github.com/Nexo-Agent/nexo/issues)
- [Discussions](https://github.com/Nexo-Agent/nexo/discussions)

---

_Documentation generated by BMAD Method `document-project` workflow_  
_For questions or improvements, please open an issue or discussion on GitHub._
