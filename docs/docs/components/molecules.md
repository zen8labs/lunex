---
sidebar_position: 3
---

# Molecules

Molecules are composed UI elements built from atoms. They have minimal UI-only logic.

## Available Molecules

### ChatSearchDialog

Search dialog for chats.

**Location:** `src/ui/molecules/ChatSearchDialog.tsx`

**Composed of:**

- `Dialog` (atom)
- `Input` (atom)
- `Button` (atom)

### AgentMentionDropdown

Autocomplete dropdown for agent mentions.

**Location:** `src/ui/molecules/AgentMentionDropdown.tsx`

**Composed of:**

- `DropdownMenu` (atom)
- `Input` (atom)

### SlashCommandDropdown

Autocomplete dropdown for slash commands.

**Location:** `src/ui/molecules/SlashCommandDropdown.tsx`

**Composed of:**

- `DropdownMenu` (atom)
- `Input` (atom)

## Complete Molecule List

See [Component Inventory](../../project-documentation/component-inventory.md) for a complete list of all molecules.

## Rules for Molecules

1. **Composed of Atoms**: Molecules should be built from atoms
2. **Minimal Logic**: Only UI-only logic (e.g., form validation)
3. **No Tauri API Calls**: Molecules should not call Tauri APIs
4. **No Redux**: Molecules should not use Redux directly
5. **Domain-Specific**: Molecules can be domain-specific but should be reusable
