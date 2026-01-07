---
sidebar_position: 2
---

# Tauri Events Reference

This document lists all available Tauri events that can be listened to from the frontend.

## Message Streaming Events

### message-started

Emitted when message generation starts.

**Payload:**

```typescript
{
  chat_id: string;
  message_id: string;
}
```

### message-chunk

Emitted for each chunk of message content during streaming.

**Payload:**

```typescript
{
  chat_id: string;
  message_id: string;
  chunk: string;
}
```

### thinking-chunk

Emitted for each chunk of thinking/reasoning content (for thinking mode).

**Payload:**

```typescript
{
  chat_id: string;
  message_id: string;
  chunk: string;
}
```

### message-complete

Emitted when message generation completes.

**Payload:**

```typescript
{
  chat_id: string;
  message_id: string;
  message: Message;
}
```

### message-error

Emitted when an error occurs during message generation.

**Payload:**

```typescript
{
  chat_id: string;
  message_id?: string;
  error: string;
}
```

### message-cancelled

Emitted when message generation is cancelled.

**Payload:**

```typescript
{
  chat_id: string;
  message_id: string;
}
```

### message-metadata-updated

Emitted when message metadata is updated (e.g., token usage).

**Payload:**

```typescript
{
  message_id: string;
  metadata: {
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

## Tool Call Events

### tool-call-request

Emitted when a tool call is requested.

**Payload:**

```typescript
{
  chat_id: string;
  tool_call_id: string;
  tool_name: string;
  arguments: Record<string, any>;
}
```

### tool-call-response

Emitted when a tool call response is received.

**Payload:**

```typescript
{
  chat_id: string;
  tool_call_id: string;
  result: any;
}
```

### tool-call-error

Emitted when a tool call encounters an error.

**Payload:**

```typescript
{
  chat_id: string;
  tool_call_id: string;
  error: string;
}
```

### tool-calls-detected

Emitted when tool calls are detected in an LLM response.

**Payload:**

```typescript
{
  chat_id: string;
  message_id: string;
  tool_calls: Array<{
    id: string;
    name: string;
    arguments: Record<string, any>;
  }>;
}
```

### tool-execution-started

Emitted when tool execution starts.

**Payload:**

```typescript
{
  chat_id: string;
  tool_call_id: string;
  tool_name: string;
}
```

### tool-execution-progress

Emitted during tool execution (for long-running tools).

**Payload:**

```typescript
{
  chat_id: string;
  tool_call_id: string;
  progress: number; // 0-100
  status: string;
}
```

### tool-execution-completed

Emitted when tool execution completes.

**Payload:**

```typescript
{
  chat_id: string;
  tool_call_id: string;
  result: any;
}
```

### tool-execution-error

Emitted when tool execution encounters an error.

**Payload:**

```typescript
{
  chat_id: string;
  tool_call_id: string;
  error: string;
}
```

### tool-permission-request

Emitted when tool execution requires user permission.

**Payload:**

```typescript
{
  chat_id: string;
  tool_call_id: string;
  tool_name: string;
  arguments: Record<string, any>;
  server_id: string;
}
```

## Agent Events

### agent-loop-iteration

Emitted when an agent loop iteration completes.

**Payload:**

```typescript
{
  chat_id: string;
  iteration: number;
  status: 'running' | 'completed' | 'error';
  result?: any;
}
```

## Menu Events

### menu-new-chat

Emitted when "New Chat" menu item is selected.

**Payload:** None

### menu-undo

Emitted when "Undo" menu item is selected.

**Payload:** None

### menu-redo

Emitted when "Redo" menu item is selected.

**Payload:** None

### menu-cut

Emitted when "Cut" menu item is selected.

**Payload:** None

### menu-copy

Emitted when "Copy" menu item is selected.

**Payload:** None

### menu-paste

Emitted when "Paste" menu item is selected.

**Payload:** None

### menu-toggle-sidebar

Emitted when "Toggle Sidebar" menu item is selected.

**Payload:** None

### menu-theme

Emitted when "Theme" menu item is selected.

**Payload:** None

### menu-settings

Emitted when "Settings" menu item is selected.

**Payload:** None

### menu-documentation

Emitted when "Documentation" menu item is selected.

**Payload:** None

### menu-about

Emitted when "About" menu item is selected.

**Payload:** None

### menu-keyboard-shortcuts

Emitted when "Keyboard Shortcuts" menu item is selected.

**Payload:** None

## Usage

### Listening to Events

Events are listened to using Tauri's `listen` function:

```typescript
import { listen } from '@tauri-apps/api/event';
import { TauriEvents } from '@/bindings/events';

const unlisten = await listen(TauriEvents.MESSAGE_CHUNK, (event) => {
  console.log('Message chunk:', event.payload);
  // Update UI with chunk
});

// Cleanup
unlisten();
```

### React Hook Example

```typescript
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { TauriEvents } from '@/bindings/events';

export function useMessageStreaming(chatId: string) {
  useEffect(() => {
    const unlisten = listen(TauriEvents.MESSAGE_CHUNK, (event) => {
      if (event.payload.chat_id === chatId) {
        // Handle chunk
      }
    });

    return () => {
      unlisten();
    };
  }, [chatId]);
}
```

### Event Payload Types

Event payloads are typed. Import types from bindings:

```typescript
import { MessageChunkPayload } from '@/bindings/events';

const unlisten = await listen<MessageChunkPayload>(
  TauriEvents.MESSAGE_CHUNK,
  (event) => {
    // event.payload is typed as MessageChunkPayload
  }
);
```

## Best Practices

### 1. Clean Up Listeners

Always clean up event listeners to prevent memory leaks:

```typescript
useEffect(() => {
  const unlisten = listen(TauriEvents.MESSAGE_CHUNK, handler);
  return () => unlisten();
}, []);
```

### 2. Filter by Context

Filter events by context (e.g., chat_id) to avoid handling irrelevant events:

```typescript
listen(TauriEvents.MESSAGE_CHUNK, (event) => {
  if (event.payload.chat_id !== currentChatId) return;
  // Handle event
});
```

### 3. Handle Errors

Handle errors appropriately:

```typescript
listen(TauriEvents.MESSAGE_ERROR, (event) => {
  toast.error(`Error: ${event.payload.error}`);
});
```
