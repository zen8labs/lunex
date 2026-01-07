---
sidebar_position: 3
---

# Code Organization

This document explains how code is organized in the Nexo codebase.

## Frontend Structure

```
src/
├── ui/                    # UI components (Atomic Design)
│   ├── atoms/            # Basic primitives
│   ├── molecules/        # Composed elements
│   ├── organisms/        # Complex sections
│   ├── layouts/          # Page layouts
│   └── screens/          # Full pages
├── hooks/                 # Custom React hooks
├── store/                 # Redux store
│   ├── slices/           # Redux slices
│   ├── index.ts          # Store configuration
│   └── hooks.ts          # Typed hooks
├── lib/                   # Utility libraries
│   ├── tauri.ts          # Tauri utilities
│   ├── utils.ts          # General utilities
│   └── tools/            # Tool utilities
├── i18n/                  # Internationalization
├── bindings/              # Generated TypeScript bindings
└── types/                 # TypeScript type definitions
```

## Backend Structure

```
src-tauri/src/
├── commands/              # Tauri command handlers
│   ├── workspace.rs
│   ├── chat.rs
│   ├── message.rs
│   └── ...
├── services/              # Business logic
│   ├── chat_service.rs
│   ├── llm_service.rs
│   └── ...
├── repositories/          # Data access
│   ├── chat_repository.rs
│   ├── message_repository.rs
│   └── ...
├── models/                # Data structures
│   ├── workspace.rs
│   ├── chat.rs
│   └── ...
├── db/                    # Database
│   ├── migrations.rs
│   └── connection.rs
├── constants/             # Constants
│   ├── commands.rs
│   └── events.rs
├── state/                 # Application state
│   └── app_state.rs
├── error.rs               # Error types
└── lib.rs                 # Library entry point
```

## Atomic Design Principles

### Atoms

Basic UI primitives with no business logic:

- `Button`, `Input`, `Card`, `Dialog`
- No Tauri API calls
- No Redux usage
- Pure presentational

### Molecules

Composed UI elements:

- `ChatSearchDialog`, `AgentMentionDropdown`
- Composed of atoms
- Minimal UI-only logic

### Organisms

Complex UI sections:

- `ChatArea`, `MessageList`, `SettingsForm`
- Can use hooks and Redux
- Can call Tauri APIs
- Organized by domain

### Layouts

Page structure definitions:

- `MainLayout`, `ChatLayout`, `SettingsLayout`

### Screens

Full page compositions:

- `ChatScreen`, `SettingsScreen`

## Naming Conventions

### Files

- **Components**: PascalCase (`ChatArea.tsx`)
- **Hooks**: camelCase with `use` prefix (`useChats.ts`)
- **Utilities**: camelCase (`utils.ts`)
- **Types**: camelCase (`types.ts`)

### Functions

- **Components**: PascalCase (`function ChatArea()`)
- **Hooks**: camelCase with `use` prefix (`function useChats()`)
- **Utilities**: camelCase (`function formatDate()`)

### Variables

- **Constants**: UPPER_SNAKE_CASE (`const MAX_MESSAGES = 100`)
- **Variables**: camelCase (`const chatId = '123'`)

## Import Organization

### Order

1. React and external libraries
2. Internal utilities
3. Types
4. Components
5. Hooks
6. Styles

### Example

```typescript
// External
import React from 'react';
import { useDispatch } from 'react-redux';

// Internal utilities
import { invokeCommand } from '@/lib/tauri';
import { TauriCommands } from '@/bindings/commands';

// Types
import type { Chat } from '@/bindings/types';

// Components
import { Button } from '@/ui/atoms/button';
import { ChatArea } from '@/ui/organisms/chat/ChatArea';

// Hooks
import { useChats } from '@/hooks/useChats';

// Styles
import './styles.css';
```

## Module Exports

### Default Exports

Use default exports for:

- Main component files
- Page components

```typescript
export default function ChatScreen() {
  // ...
}
```

### Named Exports

Use named exports for:

- Utility functions
- Types
- Constants
- Multiple related components

```typescript
export function formatDate(date: Date): string {
  // ...
}

export type Chat = {
  // ...
};
```

## Code Splitting

### Route-Based Splitting

Split code by routes:

```typescript
const ChatScreen = lazy(() => import('./screens/ChatScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));
```

### Component-Based Splitting

Split large components:

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## Type Safety

### TypeScript Strict Mode

Enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### Type Definitions

Define types for all:

- Component props
- Function parameters
- API responses
- Redux state

### Generated Types

Use generated types from Rust:

```typescript
import { TauriCommands } from '@/bindings/commands';
import type { Chat } from '@/bindings/types';
```

## Testing Structure

### Unit Tests

Place tests next to source files:

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
```

### Integration Tests

Place in `__tests__` directories:

```
src/
├── __tests__/
│   ├── integration/
│   │   └── chat.test.ts
```

## Documentation

### Code Comments

Document complex logic:

```typescript
/**
 * Sends a message to the chat and streams the response.
 *
 * @param chatId - The chat ID
 * @param content - The message content
 * @returns Promise that resolves when message is sent
 */
async function sendMessage(chatId: string, content: string): Promise<void> {
  // Implementation
}
```

### README Files

Include README files for:

- Major feature directories
- Complex modules
- Setup instructions
