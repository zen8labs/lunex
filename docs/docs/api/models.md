---
sidebar_position: 3
---

# Data Models Reference

This document describes the data models used throughout Nexo.

## Workspace

Represents a workspace (top-level organization unit).

```typescript
interface Workspace {
  id: string; // UUID
  name: string; // Display name
  created_at: number; // Unix timestamp
}
```

## Chat

Represents a chat session within a workspace.

```typescript
interface Chat {
  id: string; // UUID
  workspace_id: string; // Foreign key to Workspace
  title: string; // Chat title
  last_message?: string; // Last message preview
  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
  agent_id?: string; // Associated agent
  parent_id?: string; // Parent chat (for threads)
}
```

## Message

Represents a chat message.

```typescript
interface Message {
  id: string; // UUID
  chat_id: string; // Foreign key to Chat
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string; // Message content (markdown)
  reasoning?: string; // Thinking/reasoning content
  timestamp: number; // Unix timestamp
  assistant_message_id?: string; // Associated assistant message
  tool_call_id?: string; // Tool call identifier
  metadata?: {
    // JSON metadata
    model?: string;
    provider?: string;
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    cost?: number;
    latency_ms?: number;
  };
}
```

## WorkspaceSettings

Workspace-specific configuration.

```typescript
interface WorkspaceSettings {
  workspace_id: string; // Foreign key to Workspace
  default_model?: string; // Default LLM model
  system_prompt?: string; // System prompt
  temperature?: number; // Generation temperature (0.0-2.0)
  max_tokens?: number; // Maximum tokens
  top_p?: number; // Top-p sampling
  frequency_penalty?: number; // Frequency penalty
  presence_penalty?: number; // Presence penalty
}
```

## LLMConnection

LLM provider connection configuration.

```typescript
interface LLMConnection {
  id: string; // UUID
  name: string; // Connection name
  provider: string; // Provider type (openai, anthropic, etc.)
  api_key: string; // API key (encrypted)
  base_url: string; // API base URL
  custom_headers?: Record<string, string>; // Custom headers
  created_at: number; // Unix timestamp
}
```

## MCPServer

MCP server configuration.

```typescript
interface MCPServer {
  id: string; // UUID
  name: string; // Server name
  command: string; // Command to start server
  arguments?: string[]; // Command arguments
  env?: Record<string, string>; // Environment variables
  created_at: number; // Unix timestamp
}
```

## MCPServerConnection

MCP server connection for a workspace.

```typescript
interface MCPServerConnection {
  id: string; // UUID
  workspace_id: string; // Foreign key to Workspace
  server_id: string; // Foreign key to MCPServer
  enabled: boolean; // Whether server is enabled
  status: 'connected' | 'disconnected' | 'error';
  created_at: number; // Unix timestamp
}
```

## Prompt

Custom prompt template.

```typescript
interface Prompt {
  id: string; // UUID
  name: string; // Prompt name
  content: string; // Prompt content
  variables?: string[]; // Variable names (e.g., ["name", "topic"])
  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
}
```

## Tool

MCP tool definition.

```typescript
interface Tool {
  name: string; // Tool name
  description: string; // Tool description
  input_schema: {
    // JSON Schema for input
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}
```

## ToolResult

Result of tool execution.

```typescript
interface ToolResult {
  tool_call_id: string; // Tool call identifier
  result: any; // Tool execution result
  error?: string; // Error message (if failed)
}
```

## UsageStats

Token usage statistics.

```typescript
interface UsageStats {
  id: string; // UUID
  workspace_id: string; // Foreign key to Workspace
  model: string; // Model name
  provider: string; // Provider name
  input_tokens: number; // Input tokens
  output_tokens: number; // Output tokens
  total_tokens: number; // Total tokens
  cost: number; // Cost in USD
  timestamp: number; // Unix timestamp
}
```

## Agent

Installed agent.

```typescript
interface Agent {
  id: string; // Agent identifier
  name: string; // Agent name
  description: string; // Agent description
  version: string; // Agent version
  source: string; // Source location
  installed_at: number; // Unix timestamp
}
```

## AgentInfo

Detailed agent information.

```typescript
interface AgentInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  manifest: {
    name: string;
    description: string;
    version: string;
    author?: string;
    tools?: string[];
    instructions?: string;
  };
}
```

## PythonRuntimeStatus

Python runtime status.

```typescript
interface PythonRuntimeStatus {
  installed: boolean;
  version?: string;
  path?: string;
}
```

## NodeRuntimeStatus

Node.js runtime status.

```typescript
interface NodeRuntimeStatus {
  installed: boolean;
  version?: string;
  path?: string;
}
```

## AddonConfig

Addon configuration.

```typescript
interface AddonConfig {
  addons: Array<{
    id: string;
    name: string;
    description: string;
    version: string;
    enabled: boolean;
  }>;
}
```

## Type Definitions

All types are available from the generated bindings:

```typescript
import type {
  Workspace,
  Chat,
  Message,
  WorkspaceSettings,
  LLMConnection,
  MCPServer,
  MCPServerConnection,
  Prompt,
  Tool,
  ToolResult,
  UsageStats,
  Agent,
  AgentInfo,
} from '@/bindings/types';
```

## Database Schema

See [Data Models Documentation](../../project-documentation/data-models.md) for complete database schema documentation.
