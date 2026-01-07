---
sidebar_position: 3
---

# Workspaces

Workspaces are the top-level organization unit in Nexo. Each workspace acts as a separate project or profile with its own settings, system prompts, and chat history.

## Understanding Workspaces

A workspace is like a separate container for your conversations. You can create multiple workspaces to organize different aspects of your work:

- **Personal**: For personal projects and casual conversations
- **Work**: For professional tasks and work-related chats
- **Coding**: For programming and development tasks
- **Writing**: For content creation and writing projects

Each workspace maintains its own:

- Chat history
- System prompts
- LLM model preferences
- MCP server configurations
- Workspace-specific settings

## Creating a Workspace

1. Click the **Workspace** dropdown in the sidebar
2. Click **Create New Workspace**
3. Enter a name for your workspace
4. Click **Create**

The new workspace will be created and automatically selected.

## Switching Between Workspaces

1. Click the **Workspace** dropdown in the sidebar
2. Select the workspace you want to switch to

All chats and settings will switch to the selected workspace.

## Workspace Settings

Each workspace has its own settings that you can customize:

### System Prompt

Define the AI's personality and behavior for this workspace:

1. Go to **Settings** → **Workspace Settings**
2. Edit the **System Prompt** field
3. Click **Save**

Example system prompts:

- "You are a senior JavaScript developer who prefers concise code."
- "You are a creative writing assistant who helps with storytelling."
- "You are a data analyst who explains complex concepts simply."

### Default LLM Model

Set the default LLM model for this workspace:

1. Go to **Settings** → **Workspace Settings**
2. Select a model from the **Default Model** dropdown
3. Click **Save**

### Temperature and Generation Parameters

Adjust how the AI responds:

1. Go to **Settings** → **Workspace Settings**
2. Adjust **Temperature** (0.0 - 2.0)
   - Lower values: More focused and deterministic
   - Higher values: More creative and random
3. Adjust other parameters as needed
4. Click **Save**

## Managing Workspaces

### Renaming a Workspace

1. Click the **Workspace** dropdown
2. Click the **Settings** icon next to the workspace name
3. Enter a new name
4. Click **Save**

### Deleting a Workspace

1. Click the **Workspace** dropdown
2. Click the **Settings** icon next to the workspace name
3. Click **Delete Workspace**
4. Confirm the deletion

**Warning**: Deleting a workspace will also delete all chats within that workspace. This action cannot be undone.

## Best Practices

- **Use descriptive names**: Name workspaces clearly to identify their purpose
- **Separate contexts**: Use different workspaces for different types of work
- **Customize system prompts**: Tailor the AI's behavior to each workspace's purpose
- **Organize by project**: Create a workspace for each major project or client
