# Source Tree Analysis

**Last Updated:** 2025-01-27

## Project Root Structure

```
nexo/
├── .agent/                    # AI agent knowledge base
│   ├── ARCHITECTURE.md        # Architecture documentation
│   ├── PROJECT_STRUCTURE_MAP.md
│   └── ...
├── src/                       # React frontend source code
│   ├── ui/                    # UI components (Atomic Design)
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Redux store configuration
│   ├── lib/                   # Utility libraries
│   ├── i18n/                  # Internationalization
│   ├── models/                # TypeScript models
│   ├── types/                 # Type definitions
│   ├── bindings/              # Generated Tauri bindings
│   ├── assets/                # Static assets
│   ├── App.tsx                # Main React component
│   └── main.tsx               # Frontend entry point
├── src-tauri/                 # Rust backend and Tauri configuration
│   ├── src/
│   │   ├── commands/          # Tauri commands (API layer)
│   │   ├── services/          # Business logic layer
│   │   ├── repositories/      # Data access layer
│   │   ├── models/            # Data structures
│   │   ├── db/                # Database connection and migrations
│   │   ├── events/            # Event emitters
│   │   ├── error/             # Error types
│   │   ├── state/             # Application state
│   │   ├── constants/         # Constants and type bindings
│   │   ├── agent/             # Agent management
│   │   ├── lib.rs             # Main library entry point
│   │   └── main.rs            # Application entry point
│   ├── tauri.conf.json        # Tauri configuration
│   ├── Cargo.toml             # Rust dependencies
│   └── build.rs               # Build script
├── docs/                      # Project documentation
│   ├── project-documentation/ # Generated documentation
│   ├── design/                # Design documents
│   └── implementation/        # Implementation reports
├── scripts/                   # Maintenance and build scripts
├── public/                    # Public static assets
├── package.json               # Frontend dependencies
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── README.md                  # Project README
```

## Frontend Structure (`src/`)

### UI Components (`src/ui/`)

**Atomic Design Structure:**

```
ui/
├── atoms/                     # Basic UI primitives
│   ├── button/               # Button component
│   ├── input.tsx             # Input field
│   ├── select.tsx            # Select dropdown
│   ├── checkbox.tsx          # Checkbox
│   ├── switch.tsx             # Toggle switch
│   ├── dialog/                # Dialog component
│   ├── form/                  # Form components
│   ├── label.tsx              # Form label
│   ├── textarea.tsx           # Textarea
│   ├── card.tsx               # Card container
│   ├── table.tsx               # Table component
│   ├── tabs.tsx                # Tabs component
│   ├── tooltip.tsx             # Tooltip
│   ├── avatar.tsx              # Avatar
│   ├── separator.tsx           # Separator line
│   ├── scroll-area.tsx         # Scrollable area
│   ├── dropdown-menu.tsx       # Dropdown menu
│   ├── context-menu.tsx        # Context menu
│   ├── drawer/                 # Drawer component
│   ├── modal-stack/            # Modal stack management
│   ├── empty-state.tsx         # Empty state display
│   ├── ErrorBoundary.tsx       # Error boundary
│   ├── sonner.tsx              # Toast notifications
│   └── streamdown/             # Markdown rendering library
│
├── molecules/                 # Composed UI elements
│   ├── ChatSearchDialog.tsx   # Chat search dialog
│   ├── AgentMentionDropdown.tsx
│   ├── SlashCommandDropdown.tsx
│   └── VariableInputDialog.tsx
│
├── organisms/                 # Complex UI sections
│   ├── chat/                  # Chat-related organisms
│   │   ├── ChatArea.tsx       # Main chat area
│   │   ├── ChatInput.tsx       # Message input
│   │   ├── ChatMessages.tsx   # Message list
│   │   ├── MessageItem.tsx     # Individual message
│   │   ├── MessageList.tsx    # Message list container
│   │   ├── ThinkingItem.tsx   # Thinking mode display
│   │   ├── ToolCallItem.tsx    # Tool call display
│   │   └── AgentCard.tsx       # Agent card
│   ├── markdown/              # Markdown rendering
│   │   ├── MarkdownContent.tsx
│   │   ├── CustomCodeComponent.tsx
│   │   ├── PythonExecutor.tsx
│   │   └── RunCodeButton.tsx
│   ├── settings/              # Settings organisms
│   │   ├── AppSettings.tsx
│   │   ├── LLMConnections.tsx
│   │   ├── MCPServerConnections.tsx
│   │   ├── WorkspaceSettingsForm.tsx
│   │   ├── PromptManagement.tsx
│   │   ├── AgentSettings.tsx
│   │   ├── AddonSettings.tsx
│   │   ├── HeadersEditor.tsx
│   │   ├── About.tsx
│   │   └── usage/             # Usage statistics
│   ├── workspace/             # Workspace management
│   │   ├── WorkspaceSelector.tsx
│   │   ├── AddWorkspaceDialog.tsx
│   │   └── WorkspaceSettingsForm.tsx
│   ├── ChatSidebar.tsx        # Chat sidebar
│   ├── TitleBar.tsx           # Custom title bar
│   └── KeyboardShortcutsDialog.tsx
│
├── layouts/                   # Layout structures
│   ├── MainLayout.tsx         # Root layout with TitleBar
│   ├── ChatLayout.tsx         # Chat page layout
│   └── SettingsLayout.tsx     # Settings page layout
│
└── screens/                    # Full screen compositions
    ├── ChatScreen.tsx         # Main chat screen
    ├── SettingsScreen.tsx      # Settings screen
    ├── WorkspaceSettingsScreen.tsx
    └── WelcomeScreen.tsx      # Welcome/onboarding screen
```

**Key Rules:**

- **Atoms/Molecules**: No business logic, no Tauri API calls
- **Organisms/Screens**: Can use hooks, Redux, Tauri APIs

### Hooks (`src/hooks/`)

```
hooks/
├── useChats.ts                # Chat management
├── useMessages.ts             # Message operations
├── useChatStreaming.ts        # Event listeners for streaming
├── useWorkspaces.ts           # Workspace management
├── useAppSettings.ts          # Application settings
├── useChatInput.ts            # Chat input state
├── useKeyboardShortcuts.ts    # Keyboard shortcuts
├── useMenuEvents.ts           # Menu event handling
├── useNotificationListener.tsx # Notification events
├── useExportChat.ts           # Chat export
├── useSlashCommand.ts         # Slash command handling
├── useAgentMention.ts         # Agent mention handling
├── useDialogClick.ts          # Dialog click handling
├── useComponentPerformance.tsx # Performance monitoring
└── use-theme.ts               # Theme management
```

### Store (`src/store/`)

```
store/
├── index.ts                   # Store configuration
├── hooks.ts                   # Typed Redux hooks
├── types.ts                   # Redux types
├── sentryMiddleware.ts        # Sentry middleware
└── slices/                     # Redux slices
    ├── chatsSlice.ts          # Chat list state
    ├── messages/              # Message state (complex)
    │   ├── index.ts
    │   ├── state.ts
    │   ├── reducers.ts
    │   ├── extraReducers.ts
    │   ├── thunks/
    │   │   ├── sendMessageNew.ts
    │   │   ├── editAndResendMessage.ts
    │   │   └── fetchMessages.ts
    │   └── helpers/
    │       └── sendMessage/
    ├── workspacesSlice.ts     # Workspace list
    ├── llmConnectionsSlice.ts # LLM connections
    ├── mcpConnectionsSlice.ts # MCP connections
    ├── uiSlice.ts            # UI state (theme, sidebar, etc.)
    ├── workspaceSettingsSlice.ts
    ├── chatInputSlice.ts      # Chat input state
    ├── chatSearchSlice.ts     # Chat search state
    ├── notificationSlice.ts   # Notifications
    └── toolPermissionSlice.ts # Tool permissions
```

### Libraries (`src/lib/`)

```
lib/
├── tauri.ts                   # Tauri invocation helpers
├── utils.ts                   # General utilities
├── constants.ts               # Constants
├── model-utils.ts             # Model utilities
├── prompt-utils.ts            # Prompt utilities
├── code-block-extractor.ts    # Code block extraction
├── chat-input-settings-storage.ts
├── pyodide-loader.ts          # Pyodide loader
├── sentry-utils.ts            # Sentry utilities
├── mcp/                       # MCP types
│   ├── index.ts
│   └── types.ts
└── tools/                      # Tool types
    ├── index.ts
    └── types.ts
```

### Internationalization (`src/i18n/`)

```
i18n/
├── config.ts                  # i18next configuration
└── locales/
    ├── en/                    # English translations
    │   ├── common.json
    │   ├── chat.json
    │   └── settings.json
    └── vi/                    # Vietnamese translations
        ├── common.json
        ├── chat.json
        └── settings.json
```

## Backend Structure (`src-tauri/src/`)

### Commands (`src-tauri/src/commands/`)

**Purpose:** Tauri command handlers (API endpoints exposed to frontend)

```
commands/
├── mod.rs                     # Module exports
├── workspace.rs               # Workspace CRUD
├── chat.rs                    # Chat management, message sending
├── message.rs                 # Message operations
├── llm_connection.rs          # LLM connection management
├── mcp_connection.rs          # MCP connection management
├── mcp_tool.rs                # MCP tool operations
├── settings.rs                # App and workspace settings
├── prompt.rs                  # Prompt management
├── usage.rs                   # Usage statistics
├── python.rs                  # Python execution
└── node.rs                     # Node.js execution
```

### Services (`src-tauri/src/services/`)

**Purpose:** Business logic and orchestration

```
services/
├── mod.rs                     # Module exports
├── chat_service.rs            # Chat orchestration, LLM calls
├── llm_service.rs            # LLM API communication
├── message_service.rs         # Message business logic
├── tool_service.rs           # MCP tool execution
├── mcp_client_service.rs     # MCP client management
├── mcp_connection_service.rs # MCP connection management
├── mcp_tool_refresh_service.rs # MCP tool refresh
├── workspace_service.rs       # Workspace management
├── workspace_settings_service.rs
├── llm_connection_service.rs # LLM connection management
├── prompt_service.rs         # Prompt management
├── app_settings_service.rs   # App settings
├── usage_service.rs          # Usage tracking
├── python_runtime.rs         # Python runtime management
├── node_runtime.rs           # Node.js runtime management
└── index_config_service.rs   # Index configuration
```

### Repositories (`src-tauri/src/repositories/`)

**Purpose:** Data access layer (SQLite operations)

```
repositories/
├── mod.rs                     # Module exports
├── chat_repository.rs         # Chat data operations
├── message_repository.rs      # Message data operations
├── workspace_repository.rs    # Workspace data operations
├── workspace_settings_repository.rs
├── llm_connection_repository.rs
├── mcp_connection_repository.rs
├── prompt_repository.rs       # Prompt storage
├── app_settings_repository.rs
└── usage_repository.rs        # Usage statistics
```

### Models (`src-tauri/src/models/`)

**Purpose:** Data structures and types

```
models/
├── mod.rs                     # Module exports
├── chat.rs                    # Chat model
├── message.rs                 # Message model
├── workspace.rs               # Workspace model
├── workspace_settings.rs     # Workspace settings
├── llm_connection.rs          # LLM connection
├── llm_types.rs              # LLM types (requests, responses)
├── mcp_connection.rs          # MCP connection
├── mcp_tool.rs               # MCP tool
├── prompt.rs                 # Prompt
├── app_setting.rs            # App setting
├── usage.rs                  # Usage statistics
└── addon_config.rs           # Addon configuration
```

### Database (`src-tauri/src/db/`)

```
db/
├── mod.rs                     # Module exports
├── connection.rs              # Database connection
└── migrations.rs              # Database migrations
```

### Events (`src-tauri/src/events/`)

```
events/
├── mod.rs                     # Module exports
├── message_emitter.rs         # Message streaming events
├── tool_emitter.rs            # Tool execution events
└── agent_emitter.rs           # Agent loop events
```

### State (`src-tauri/src/state/`)

```
state/
├── mod.rs                     # Module exports
├── app_state.rs              # Application state (services, repos)
└── mcp_client_state.rs      # MCP client state
```

### Constants (`src-tauri/src/constants/`)

```
constants/
├── mod.rs                     # Module exports
├── commands.rs               # Command name constants (generates TS bindings)
├── events.rs                 # Event name constants (generates TS bindings)
└── tests.rs                  # Test utilities
```

### Agent (`src-tauri/src/agent/`)

```
agent/
├── mod.rs                     # Module exports
├── manager.rs                # Agent manager
├── commands.rs               # Agent commands
├── downloader.rs             # Agent downloader
└── common.rs                 # Common agent utilities
```

## Critical Directories

### Frontend Entry Points

- `src/main.tsx` - Frontend entry point, Sentry initialization
- `src/App.tsx` - Main React component, Redux provider setup

### Backend Entry Points

- `src-tauri/src/main.rs` - Application entry point
- `src-tauri/src/lib.rs` - Library entry point, Tauri setup

### Configuration Files

- `package.json` - Frontend dependencies and scripts
- `src-tauri/Cargo.toml` - Rust dependencies
- `src-tauri/tauri.conf.json` - Tauri configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration

### Database

- `src-tauri/src/db/migrations.rs` - All database schema definitions

### Type Bindings

- `src-tauri/src/constants/commands.rs` - Generates `src/bindings/commands.ts`
- `src-tauri/src/constants/events.rs` - Generates `src/bindings/events.ts`

## Integration Points

### Frontend → Backend

- **Tauri Invoke**: `src/lib/tauri.ts` → `src-tauri/src/commands/*.rs`
- **Type Safety**: Generated bindings in `src/bindings/`

### Backend → Frontend

- **Tauri Events**: `src-tauri/src/events/*.rs` → `src/hooks/useChatStreaming.ts`
- **Event Types**: Generated bindings in `src/bindings/events.ts`

### Database Access

- **Repositories**: `src-tauri/src/repositories/*.rs` → SQLite via `rusqlite`

### External Services

- **LLM APIs**: `src-tauri/src/services/llm_service.rs` → HTTP via `reqwest`
- **MCP Servers**: `src-tauri/src/services/mcp_client_service.rs` → MCP protocol

---

_Documentation generated by BMAD Method `document-project` workflow_
