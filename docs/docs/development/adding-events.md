---
sidebar_position: 5
---

# Adding New Events

This guide explains how to add new Tauri events to Nexo.

## Step-by-Step Process

### 1. Define Event Constant

Add the event name to `src-tauri/src/constants/events.rs`:

```rust
impl TauriEvents {
    // ... existing events
    pub const MY_NEW_EVENT: &'static str = "my-new-event";
}
```

### 2. Create Event Emitter (if needed)

If you need a new event emitter, create it in `src-tauri/src/events/`:

```rust
use tauri::AppHandle;
use crate::constants::TauriEvents;

pub struct MyEventEmitter {
    app: AppHandle,
}

impl MyEventEmitter {
    pub fn new(app: AppHandle) -> Self {
        Self { app }
    }

    pub async fn emit_my_event(&self, payload: MyPayload) -> Result<(), AppError> {
        self.app.emit(TauriEvents.MY_NEW_EVENT, payload)?;
        Ok(())
    }
}
```

### 3. Emit Event

Emit the event from your service:

```rust
use crate::events::MyEventEmitter;

let emitter = MyEventEmitter::new(app.clone());
emitter.emit_my_event(payload).await?;
```

### 4. Regenerate TypeScript Bindings

Run the bindings generation command:

```bash
yarn gen:bindings
```

This will update `src/bindings/events.ts` with your new event.

### 5. Listen in Frontend

Listen to the event in your frontend:

```typescript
import { listen } from '@tauri-apps/api/event';
import { TauriEvents } from '@/bindings/events';

useEffect(() => {
  const unlisten = listen(TauriEvents.MY_NEW_EVENT, (event) => {
    console.log('Event received:', event.payload);
    // Handle event
  });

  return () => {
    unlisten();
  };
}, []);
```

## Event Patterns

### Simple Event

An event with a simple payload:

```rust
#[tauri::command]
pub async fn trigger_event(app: AppHandle) -> Result<(), AppError> {
    app.emit(TauriEvents.MY_EVENT, "payload")?;
    Ok(())
}
```

### Event with Structured Payload

An event with a structured payload:

```rust
#[derive(Serialize)]
struct MyPayload {
    id: String,
    data: String,
}

app.emit(TauriEvents.MY_EVENT, MyPayload {
    id: "123".to_string(),
    data: "value".to_string(),
})?;
```

### Streaming Events

Events emitted during a stream:

```rust
while let Some(chunk) = stream.next().await {
    app.emit(TauriEvents.MY_STREAM_EVENT, chunk)?;
}
```

## Event Types

### Message Events

Events related to message generation:

- `message-started`
- `message-chunk`
- `message-complete`
- `message-error`

### Tool Events

Events related to tool execution:

- `tool-call-request`
- `tool-execution-started`
- `tool-execution-completed`

### Menu Events

Events from menu actions:

- `menu-new-chat`
- `menu-settings`

## Best Practices

1. **Use Descriptive Names**: Event names should clearly describe what they represent
2. **Type Payloads**: Use typed payloads for better type safety
3. **Clean Up Listeners**: Always clean up event listeners in React hooks
4. **Filter by Context**: Filter events by context (e.g., chat_id) when needed
5. **Handle Errors**: Handle event errors appropriately
