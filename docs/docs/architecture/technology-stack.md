---
sidebar_position: 2
---

# Technology Stack

Nexo uses a modern, performant technology stack optimized for desktop applications.

## Frontend Stack

| Category          | Technology          | Version | Purpose               |
| ----------------- | ------------------- | ------- | --------------------- |
| Framework         | React               | 18.3.1  | UI framework          |
| Language          | TypeScript          | 5.6.2   | Type safety           |
| State Management  | Redux Toolkit       | 2.11.2  | Global state          |
| UI Components     | Radix UI            | Latest  | Accessible primitives |
| Styling           | Tailwind CSS        | 4.1.18  | Utility-first CSS     |
| Build Tool        | Vite                | 6.0.3   | Build and dev server  |
| Markdown          | react-markdown      | 10.1.0  | Markdown rendering    |
| Math              | KaTeX               | 0.16.27 | LaTeX rendering       |
| Code Highlighting | Shiki, highlight.js | Latest  | Syntax highlighting   |
| Diagrams          | Mermaid             | 11.12.2 | Diagram rendering     |
| i18n              | i18next             | 25.7.3  | Internationalization  |

## Backend Stack

| Category        | Technology        | Version      | Purpose                   |
| --------------- | ----------------- | ------------ | ------------------------- |
| Framework       | Tauri             | 2.0          | Desktop app framework     |
| Language        | Rust              | Edition 2021 | System programming        |
| Database        | SQLite (rusqlite) | 0.31         | Local data storage        |
| HTTP Client     | reqwest           | 0.12         | HTTP requests to LLM APIs |
| MCP SDK         | rust-mcp-sdk      | 0.7          | Model Context Protocol    |
| Async Runtime   | Tokio             | 1.x          | Async/await support       |
| Error Tracking  | Sentry            | 0.34         | Error monitoring          |
| Type Generation | ts-rs             | 9.0          | TypeScript bindings       |

## Runtime Support

### Python Runtime

- **Pyodide**: Python interpreter compiled to WebAssembly
- **Purpose**: Execute Python code in chat messages
- **Location**: Loaded dynamically in frontend

### Node.js Runtime

- **Purpose**: Execute JavaScript/Node.js code
- **Integration**: Via Tauri commands

## Development Tools

### Frontend

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Vite**: Fast HMR and building

### Backend

- **rustfmt**: Rust code formatting
- **Clippy**: Rust linter
- **cargo**: Package manager and build tool

## Why These Technologies?

### React + TypeScript

- **Mature ecosystem**: Large community and extensive libraries
- **Type safety**: Catch errors at compile time
- **Component reusability**: Atomic Design principles
- **Performance**: Virtual DOM and efficient rendering

### Tauri + Rust

- **Small bundle size**: Much smaller than Electron
- **Performance**: Native performance with Rust
- **Security**: Process isolation and sandboxing
- **Cross-platform**: Single codebase for all platforms

### SQLite

- **Local-first**: No external dependencies
- **Lightweight**: Minimal resource usage
- **Reliable**: Battle-tested database
- **Embedded**: No separate server process

### Redux Toolkit

- **Predictable state**: Centralized state management
- **DevTools**: Excellent debugging experience
- **Async handling**: Built-in support for async operations
- **TypeScript support**: Full type safety

## Build Process

### Frontend Build

1. **TypeScript compilation**: Type checking and transpilation
2. **Vite bundling**: Code splitting and optimization
3. **Asset processing**: Images, fonts, CSS
4. **Output**: Static files for Tauri

### Backend Build

1. **Rust compilation**: Cargo builds Rust code
2. **Type generation**: Generate TypeScript bindings
3. **Bundle creation**: Package for target platform
4. **Output**: Native executable with embedded frontend

## Platform Support

- **macOS**: Intel (x86_64) and Apple Silicon (aarch64)
- **Windows**: Windows 10 and 11
- **Linux**: Debian/Ubuntu (.deb) and AppImage
