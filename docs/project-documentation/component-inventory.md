# Component Inventory

**Last Updated:** 2025-01-27

## Overview

Nexo's frontend follows **Atomic Design principles** with clear separation between presentation and business logic. Components are organized by complexity level: atoms, molecules, organisms, layouts, and screens.

## Component Categories

### Atoms (Basic Primitives)

**Location:** `src/ui/atoms/`

Basic UI building blocks with no business logic or Tauri API calls.

| Component     | File                | Purpose                                |
| ------------- | ------------------- | -------------------------------------- |
| Button        | `button/button.tsx` | Primary button component with variants |
| Input         | `input.tsx`         | Text input field                       |
| Textarea      | `textarea.tsx`      | Multi-line text input                  |
| Select        | `select.tsx`        | Dropdown select                        |
| Checkbox      | `checkbox.tsx`      | Checkbox input                         |
| Switch        | `switch.tsx`        | Toggle switch                          |
| Label         | `label.tsx`         | Form label                             |
| Card          | `card.tsx`          | Card container                         |
| Table         | `table.tsx`         | Table component                        |
| Tabs          | `tabs.tsx`          | Tab navigation                         |
| Tooltip       | `tooltip.tsx`       | Tooltip display                        |
| Avatar        | `avatar.tsx`        | User avatar                            |
| Separator     | `separator.tsx`     | Visual separator                       |
| ScrollArea    | `scroll-area.tsx`   | Scrollable container                   |
| DropdownMenu  | `dropdown-menu.tsx` | Dropdown menu                          |
| ContextMenu   | `context-menu.tsx`  | Context menu                           |
| Dialog        | `dialog/`           | Modal dialog system                    |
| Drawer        | `drawer/`           | Drawer/sidebar                         |
| Form          | `form/`             | Form components and validation         |
| ModalStack    | `modal-stack/`      | Modal stack management                 |
| EmptyState    | `empty-state.tsx`   | Empty state display                    |
| ErrorBoundary | `ErrorBoundary.tsx` | React error boundary                   |
| Sonner        | `sonner.tsx`        | Toast notifications                    |
| Streamdown    | `streamdown/`       | Markdown rendering library             |

**Key Characteristics:**

- Pure presentational components
- No business logic
- No Tauri API calls
- Reusable across the application

### Molecules (Composed Elements)

**Location:** `src/ui/molecules/`

Composed UI elements built from atoms, with minimal UI-only logic.

| Component            | File                       | Purpose                    |
| -------------------- | -------------------------- | -------------------------- |
| ChatSearchDialog     | `ChatSearchDialog.tsx`     | Chat search dialog         |
| AgentMentionDropdown | `AgentMentionDropdown.tsx` | Agent mention autocomplete |
| SlashCommandDropdown | `SlashCommandDropdown.tsx` | Slash command autocomplete |
| VariableInputDialog  | `VariableInputDialog.tsx`  | Variable input dialog      |

**Key Characteristics:**

- Composed of atoms
- Minimal UI-only logic
- No Tauri API calls
- Domain-specific but reusable

### Organisms (Complex Sections)

**Location:** `src/ui/organisms/`

Complex UI sections that can use hooks, Redux, and Tauri APIs.

#### Chat Organisms (`src/ui/organisms/chat/`)

| Component    | File               | Purpose                        |
| ------------ | ------------------ | ------------------------------ |
| ChatArea     | `ChatArea.tsx`     | Main chat area container       |
| ChatInput    | `ChatInput.tsx`    | Message input with send button |
| ChatMessages | `ChatMessages.tsx` | Message list display           |
| MessageList  | `MessageList.tsx`  | Message list container         |
| MessageItem  | `MessageItem.tsx`  | Individual message display     |
| ThinkingItem | `ThinkingItem.tsx` | Thinking mode display          |
| ToolCallItem | `ToolCallItem.tsx` | Tool call display              |
| AgentCard    | `AgentCard.tsx`    | Agent card display             |

#### Markdown Organisms (`src/ui/organisms/markdown/`)

| Component           | File                      | Purpose                     |
| ------------------- | ------------------------- | --------------------------- |
| MarkdownContent     | `MarkdownContent.tsx`     | Main markdown renderer      |
| CustomCodeComponent | `CustomCodeComponent.tsx` | Custom code block rendering |
| PythonExecutor      | `PythonExecutor.tsx`      | Python code execution       |
| RunCodeButton       | `RunCodeButton.tsx`       | Code execution button       |

#### Settings Organisms (`src/ui/organisms/settings/`)

| Component             | File                        | Purpose                     |
| --------------------- | --------------------------- | --------------------------- |
| AppSettings           | `AppSettings.tsx`           | Application settings        |
| LLMConnections        | `LLMConnections.tsx`        | LLM connection management   |
| MCPServerConnections  | `MCPServerConnections.tsx`  | MCP server management       |
| WorkspaceSettingsForm | `WorkspaceSettingsForm.tsx` | Workspace settings form     |
| PromptManagement      | `PromptManagement.tsx`      | Prompt template management  |
| AgentSettings         | `AgentSettings.tsx`         | Agent configuration         |
| AddonSettings         | `AddonSettings.tsx`         | Addon management            |
| HeadersEditor         | `HeadersEditor.tsx`         | HTTP headers editor         |
| About                 | `About.tsx`                 | About dialog                |
| Usage                 | `usage/`                    | Usage statistics components |

#### Workspace Organisms (`src/ui/organisms/workspace/`)

| Component             | File                        | Purpose                     |
| --------------------- | --------------------------- | --------------------------- |
| WorkspaceSelector     | `WorkspaceSelector.tsx`     | Workspace dropdown selector |
| AddWorkspaceDialog    | `AddWorkspaceDialog.tsx`    | Create workspace dialog     |
| WorkspaceSettingsForm | `WorkspaceSettingsForm.tsx` | Workspace settings form     |

#### Other Organisms

| Component               | File                          | Purpose                      |
| ----------------------- | ----------------------------- | ---------------------------- |
| ChatSidebar             | `ChatSidebar.tsx`             | Chat list sidebar            |
| TitleBar                | `TitleBar.tsx`                | Custom title bar             |
| KeyboardShortcutsDialog | `KeyboardShortcutsDialog.tsx` | Keyboard shortcuts reference |

**Key Characteristics:**

- Can use React hooks
- Can use Redux for state management
- Can call Tauri APIs via hooks
- Organized by domain/feature

### Layouts

**Location:** `src/ui/layouts/`

Layout structure definitions that compose organisms and screens.

| Component      | File                 | Purpose                                |
| -------------- | -------------------- | -------------------------------------- |
| MainLayout     | `MainLayout.tsx`     | Root layout with TitleBar, routing     |
| ChatLayout     | `ChatLayout.tsx`     | Chat page layout (sidebar + chat area) |
| SettingsLayout | `SettingsLayout.tsx` | Settings page layout                   |

**Key Characteristics:**

- Define page structure
- Handle routing and navigation
- Compose organisms and screens

### Screens

**Location:** `src/ui/screens/`

Full screen compositions that represent complete pages.

| Component               | File                          | Purpose                   |
| ----------------------- | ----------------------------- | ------------------------- |
| ChatScreen              | `ChatScreen.tsx`              | Main chat screen          |
| SettingsScreen          | `SettingsScreen.tsx`          | Settings screen           |
| WorkspaceSettingsScreen | `WorkspaceSettingsScreen.tsx` | Workspace settings screen |
| WelcomeScreen           | `WelcomeScreen.tsx`           | Welcome/onboarding screen |

**Key Characteristics:**

- Complete page compositions
- Use layouts and organisms
- Handle page-level state and logic

## Component Patterns

### State Management

**Atoms/Molecules:**

- Use local state only (`useState`)
- No Redux
- No Tauri APIs

**Organisms/Screens:**

- Use Redux for global state
- Use custom hooks for Tauri API calls
- Can use local state for UI-only state

### Data Fetching

**Pattern:**

```typescript
// In organism/screen
const dispatch = useAppDispatch();
const chats = useAppSelector((state) => state.chats.items);

useEffect(() => {
  dispatch(fetchChats(workspaceId));
}, [workspaceId, dispatch]);
```

### Event Handling

**Pattern:**

```typescript
// Custom hook for Tauri events
useChatStreaming(); // Sets up event listeners

// In component
const streamingMessageId = useAppSelector(
  (state) => state.messages.streamingMessageId
);
```

## Design System

### Styling

- **Framework:** Tailwind CSS 4.1.18
- **Components:** Radix UI primitives
- **Theming:** CSS variables + Tailwind dark mode
- **Custom Themes:** GitHub Light/Dark, Gruvbox, Midnight, Dracula

### Typography

- System fonts with fallbacks
- Responsive font sizes
- Consistent line heights

### Spacing

- Tailwind spacing scale
- Consistent padding/margins
- Responsive spacing

### Colors

- Semantic color tokens
- Theme-aware colors
- Accessible contrast ratios

## Component Reusability

### Shared Components

Components in `atoms/` and `molecules/` are designed for reuse across the application.

### Domain-Specific Components

Components in `organisms/` are domain-specific but can be reused within their domain.

### Composition Pattern

Higher-level components compose lower-level components:

```
Screen → Layout → Organisms → Molecules → Atoms
```

## Component Testing

### Testing Strategy

- **Unit Tests:** For utilities and pure functions
- **Component Tests:** For atoms and molecules (React Testing Library)
- **Integration Tests:** For organisms and screens
- **E2E Tests:** For critical user flows

### Test Location

Tests should be co-located with components or in a `__tests__` directory.

---

_Documentation generated by BMAD Method `document-project` workflow_
