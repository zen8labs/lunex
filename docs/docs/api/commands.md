---
sidebar_position: 1
---

# Tauri Commands Reference

This document lists all available Tauri commands that can be invoked from the frontend.

## Workspace Commands

### create_workspace

Create a new workspace.

**Parameters:**

```typescript
{
  name: string;
}
```

**Returns:** `Workspace`

### get_workspaces

Get all workspaces.

**Parameters:** None

**Returns:** `Workspace[]`

### update_workspace

Update a workspace.

**Parameters:**

```typescript
{
  id: string;
  name: string;
}
```

**Returns:** `Workspace`

### delete_workspace

Delete a workspace.

**Parameters:**

```typescript
{
  id: string;
}
```

**Returns:** `void`

## Chat Commands

### create_chat

Create a new chat.

**Parameters:**

```typescript
{
  workspace_id: string;
  title: string;
  agent_id?: string;
  parent_id?: string;
}
```

**Returns:** `Chat`

### get_chats

Get all chats for a workspace.

**Parameters:**

```typescript
{
  workspace_id: string;
}
```

**Returns:** `Chat[]`

### update_chat

Update a chat.

**Parameters:**

```typescript
{
  id: string;
  title?: string;
  last_message?: string;
}
```

**Returns:** `Chat`

### delete_chat

Delete a chat.

**Parameters:**

```typescript
{
  id: string;
}
```

**Returns:** `void`

### delete_all_chats_by_workspace

Delete all chats in a workspace.

**Parameters:**

```typescript
{
  workspace_id: string;
}
```

**Returns:** `void`

### send_message

Send a message in a chat.

**Parameters:**

```typescript
{
  chat_id: string;
  content: string;
  model?: string;
  temperature?: number;
  system_prompt?: string;
}
```

**Returns:** `Message`

**Note:** This command streams responses via events. See [Events Reference](./events.md).

### edit_and_resend_message

Edit a message and resend.

**Parameters:**

```typescript
{
  message_id: string;
  new_content: string;
}
```

**Returns:** `Message`

### respond_tool_permission

Respond to a tool permission request.

**Parameters:**

```typescript
{
  tool_call_id: string;
  allowed: boolean;
}
```

**Returns:** `void`

## Message Commands

### create_message

Create a message.

**Parameters:**

```typescript
{
  chat_id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  reasoning?: string;
  assistant_message_id?: string;
  tool_call_id?: string;
  metadata?: Record<string, any>;
}
```

**Returns:** `Message`

### get_messages

Get messages for a chat.

**Parameters:**

```typescript
{
  chat_id: string;
}
```

**Returns:** `Message[]`

### update_message

Update a message.

**Parameters:**

```typescript
{
  id: string;
  content?: string;
  metadata?: Record<string, any>;
}
```

**Returns:** `Message`

### delete_message

Delete a message.

**Parameters:**

```typescript
{
  id: string;
}
```

**Returns:** `void`

### delete_messages_after

Delete all messages after a specific message.

**Parameters:**

```typescript
{
  chat_id: string;
  message_id: string;
}
```

**Returns:** `void`

### cancel_message

Cancel an in-progress message generation.

**Parameters:**

```typescript
{
  chat_id: string;
}
```

**Returns:** `void`

## MCP Server Commands

### create_mcp_server

Create an MCP server configuration.

**Parameters:**

```typescript
{
  name: string;
  command: string;
  arguments?: string[];
  env?: Record<string, string>;
}
```

**Returns:** `MCPServer`

### get_mcp_servers

Get all MCP server configurations.

**Parameters:** None

**Returns:** `MCPServer[]`

### update_mcp_server

Update an MCP server configuration.

**Parameters:**

```typescript
{
  id: string;
  name?: string;
  command?: string;
  arguments?: string[];
  env?: Record<string, string>;
}
```

**Returns:** `MCPServer`

### delete_mcp_server

Delete an MCP server configuration.

**Parameters:**

```typescript
{
  id: string;
}
```

**Returns:** `void`

## MCP Connection Commands

### create_mcp_server_connection

Create an MCP server connection.

**Parameters:**

```typescript
{
  workspace_id: string;
  server_id: string;
  enabled: boolean;
}
```

**Returns:** `MCPServerConnection`

### get_mcp_server_connections

Get all MCP server connections for a workspace.

**Parameters:**

```typescript
{
  workspace_id: string;
}
```

**Returns:** `MCPServerConnection[]`

### update_mcp_server_connection

Update an MCP server connection.

**Parameters:**

```typescript
{
  id: string;
  enabled?: boolean;
}
```

**Returns:** `MCPServerConnection`

### delete_mcp_server_connection

Delete an MCP server connection.

**Parameters:**

```typescript
{
  id: string;
}
```

**Returns:** `void`

### update_mcp_server_status

Update MCP server connection status.

**Parameters:**

```typescript
{
  id: string;
  status: 'connected' | 'disconnected' | 'error';
}
```

**Returns:** `void`

## App Settings Commands

### save_app_setting

Save an application setting.

**Parameters:**

```typescript
{
  key: string;
  value: any;
}
```

**Returns:** `void`

### get_app_setting

Get an application setting.

**Parameters:**

```typescript
{
  key: string;
}
```

**Returns:** `any`

### get_all_app_settings

Get all application settings.

**Parameters:** None

**Returns:** `Record<string, any>`

## Prompt Commands

### create_prompt

Create a custom prompt template.

**Parameters:**

```typescript
{
  name: string;
  content: string;
  variables?: string[];
}
```

**Returns:** `Prompt`

### get_prompts

Get all prompt templates.

**Parameters:** None

**Returns:** `Prompt[]`

### update_prompt

Update a prompt template.

**Parameters:**

```typescript
{
  id: string;
  name?: string;
  content?: string;
  variables?: string[];
}
```

**Returns:** `Prompt`

### delete_prompt

Delete a prompt template.

**Parameters:**

```typescript
{
  id: string;
}
```

**Returns:** `void`

## MCP Tools Commands

### test_mcp_connection_and_fetch_tools

Test MCP connection and fetch available tools.

**Parameters:**

```typescript
{
  server_id: string;
}
```

**Returns:** `Tool[]`

### connect_mcp_server_and_fetch_tools

Connect to MCP server and fetch tools.

**Parameters:**

```typescript
{
  server_id: string;
}
```

**Returns:** `Tool[]`

### get_mcp_client

Get MCP client instance.

**Parameters:**

```typescript
{
  server_id: string;
}
```

**Returns:** `MCPClient`

### call_mcp_tool

Call an MCP tool.

**Parameters:**

```typescript
{
  server_id: string;
  tool_name: string;
  arguments: Record<string, any>;
}
```

**Returns:** `ToolResult`

### disconnect_mcp_client

Disconnect MCP client.

**Parameters:**

```typescript
{
  server_id: string;
}
```

**Returns:** `void`

## Python Runtime Commands

### get_python_runtimes_status

Get Python runtime status.

**Parameters:** None

**Returns:** `PythonRuntimeStatus`

### install_python_runtime

Install Python runtime.

**Parameters:**

```typescript
{
  version: string;
}
```

**Returns:** `void`

### uninstall_python_runtime

Uninstall Python runtime.

**Parameters:**

```typescript
{
  version: string;
}
```

**Returns:** `void`

## Node Runtime Commands

### get_node_runtimes_status

Get Node.js runtime status.

**Parameters:** None

**Returns:** `NodeRuntimeStatus`

### install_node_runtime

Install Node.js runtime.

**Parameters:**

```typescript
{
  version: string;
}
```

**Returns:** `void`

### uninstall_node_runtime

Uninstall Node.js runtime.

**Parameters:**

```typescript
{
  version: string;
}
```

**Returns:** `void`

## Addon Commands

### get_addon_config

Get addon configuration.

**Parameters:** None

**Returns:** `AddonConfig`

### refresh_addon_config

Refresh addon configuration.

**Parameters:** None

**Returns:** `AddonConfig`

## Agent Commands

### install_agent

Install an agent.

**Parameters:**

```typescript
{
  agent_id: string;
  source: string;
}
```

**Returns:** `Agent`

### get_installed_agents

Get all installed agents.

**Parameters:** None

**Returns:** `Agent[]`

### delete_agent

Delete an agent.

**Parameters:**

```typescript
{
  agent_id: string;
}
```

**Returns:** `void`

### get_agent_info

Get agent information.

**Parameters:**

```typescript
{
  agent_id: string;
}
```

**Returns:** `AgentInfo`

## Usage

### Invoking Commands

Commands are invoked using the `invokeCommand` utility:

```typescript
import { invokeCommand } from '@/lib/tauri';
import { TauriCommands } from '@/bindings/commands';

const workspace = await invokeCommand(TauriCommands.CREATE_WORKSPACE, {
  name: 'My Workspace',
});
```

### Error Handling

Commands return `Result<T, AppError>`. Handle errors appropriately:

```typescript
try {
  const result = await invokeCommand(TauriCommands.CREATE_WORKSPACE, { name });
  // Success
} catch (error) {
  // Handle error
  console.error('Failed to create workspace:', error);
}
```
