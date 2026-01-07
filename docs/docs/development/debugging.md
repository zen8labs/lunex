---
sidebar_position: 8
---

# Debugging

This guide covers debugging techniques and tools for Nexo development.

## Frontend Debugging

### Browser DevTools

Tauri includes browser DevTools in development mode:

1. Right-click in the app
2. Select "Inspect Element"
3. Use Chrome DevTools for debugging

### React DevTools

Install React DevTools browser extension:

- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Redux DevTools

Redux DevTools are available in development mode:

- View state changes
- Time-travel debugging
- Action replay

### Console Logging

Use console logging for debugging:

```typescript
console.log('Debug info:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### Debugger Statement

Use debugger statement to pause execution:

```typescript
function myFunction() {
  debugger; // Execution pauses here
  // ...
}
```

## Backend Debugging

### Rust Debugger

Use VS Code with rust-analyzer extension:

1. Set breakpoints in Rust code
2. Start debugging session
3. Step through code

### Print Debugging

Use `println!` or `eprintln!` for debug output:

```rust
println!("Debug: {:?}", data);
eprintln!("Error: {}", error);
```

### Logging

Use logging crate for structured logging:

```rust
use log::{info, warn, error};

info!("Processing request");
warn!("Deprecated API used");
error!("Failed to process: {}", error);
```

## Tauri Debugging

### IPC Debugging

Debug IPC communication:

```typescript
// Frontend
const result = await invokeCommand(command, params);
console.log('Command result:', result);
```

```rust
// Backend
#[tauri::command]
pub async fn my_command(params: Params) -> Result<Response, AppError> {
    println!("Command called with: {:?}", params);
    // ...
}
```

### Event Debugging

Debug event emission:

```typescript
// Frontend
listen(TauriEvents.MY_EVENT, (event) => {
  console.log('Event received:', event.payload);
});
```

```rust
// Backend
app.emit(TauriEvents.MY_EVENT, payload)?;
println!("Event emitted: {:?}", payload);
```

## Database Debugging

### SQLite CLI

Use SQLite CLI to inspect database:

```bash
sqlite3 ~/.local/share/com.nexo.app/database.db
```

### Query Logging

Log SQL queries:

```rust
let mut stmt = conn.prepare("SELECT * FROM table WHERE id = ?1")?;
println!("Executing query: SELECT * FROM table WHERE id = ?");
```

## Performance Debugging

### React Profiler

Use React Profiler to identify performance issues:

```typescript
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

### Rust Profiling

Use `cargo flamegraph` for profiling:

```bash
cargo flamegraph --bin nexo
```

## Error Tracking

### Sentry

Sentry is integrated for error tracking in production:

- Automatic error capture
- Stack traces
- User context
- Performance monitoring

### Local Error Handling

Handle errors locally for debugging:

```typescript
try {
  await someOperation();
} catch (error) {
  console.error('Operation failed:', error);
  // Debug information
}
```

## Common Issues

### TypeScript Bindings Not Updating

```bash
yarn gen:bindings
```

### Hot Reload Not Working

- Restart dev server
- Clear browser cache
- Check Vite configuration

### Database Locked

- Close all database connections
- Check for long-running transactions
- Restart application

## Best Practices

1. **Use Debugger**: Use debugger instead of excessive logging
2. **Log Context**: Include context in log messages
3. **Test Locally**: Reproduce issues locally before debugging
4. **Use DevTools**: Leverage browser and React DevTools
5. **Profile Performance**: Use profiling tools to identify bottlenecks
