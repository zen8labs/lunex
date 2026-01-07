---
sidebar_position: 4
---

# Organisms

Organisms are complex UI sections that can use hooks, Redux, and Tauri APIs. They are organized by domain.

## Chat Organisms

**Location:** `src/ui/organisms/chat/`

### ChatArea

Main chat area container.

**Location:** `src/ui/organisms/chat/ChatArea.tsx`

**Features:**

- Message display
- Streaming support
- Tool call display

### ChatInput

Message input with send button.

**Location:** `src/ui/organisms/chat/ChatInput.tsx`

**Features:**

- Text input
- Send button
- Slash commands
- Agent mentions

### MessageList

Message list container.

**Location:** `src/ui/organisms/chat/MessageList.tsx`

**Features:**

- Virtual scrolling
- Message rendering
- Tool call display

## Settings Organisms

**Location:** `src/ui/organisms/settings/`

### SettingsForm

Settings form component.

**Features:**

- Form validation
- Settings persistence
- Error handling

## Markdown Organisms

**Location:** `src/ui/organisms/markdown/`

### MarkdownContent

Main markdown renderer.

**Features:**

- Markdown rendering
- Code highlighting
- LaTeX math
- Mermaid diagrams

### PythonExecutor

Python code execution.

**Features:**

- Code execution
- Output display
- Error handling

## Complete Organism List

See [Component Inventory](../../project-documentation/component-inventory.md) for a complete list of all organisms.

## Rules for Organisms

1. **Can Use Hooks**: Organisms can use custom hooks
2. **Can Use Redux**: Organisms can use Redux for state management
3. **Can Call Tauri APIs**: Organisms can call Tauri APIs via hooks
4. **Domain-Specific**: Organisms are organized by domain
5. **Complex Logic**: Organisms can contain complex business logic
