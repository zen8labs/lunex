---
sidebar_position: 4
---

# Adding New Commands

This guide explains how to add new Tauri commands to Nexo.

## Step-by-Step Process

### 1. Define Command Constant

Add the command name to `src-tauri/src/constants/commands.rs`:

```rust
impl TauriCommands {
    // ... existing commands
    pub const MY_NEW_COMMAND: &'static str = "my_new_command";
}
```

### 2. Implement Command Handler

Create or edit a command file in `src-tauri/src/commands/`:

```rust
use tauri::AppHandle;
use crate::error::AppError;
use crate::state::AppState;

#[tauri::command]
pub async fn my_new_command(
    app: AppHandle,
    param1: String,
    param2: Option<i32>,
) -> Result<Response, AppError> {
    let state = app.state::<AppState>();
    let service = &state.my_service;

    let result = service.do_something(param1, param2).await?;
    Ok(result)
}
```

### 3. Register Command

Add the command to `src-tauri/src/lib.rs`:

```rust
.invoke_handler(tauri::generate_handler![
    // ... existing commands
    commands::my_feature::my_new_command,
])
```

### 4. Regenerate TypeScript Bindings

Run the bindings generation command:

```bash
yarn gen:bindings
```

This will update `src/bindings/commands.ts` with your new command.

### 5. Use in Frontend

Use the command in your frontend code:

```typescript
import { invokeCommand } from '@/lib/tauri';
import { TauriCommands } from '@/bindings/commands';

const result = await invokeCommand(TauriCommands.MY_NEW_COMMAND, {
  param1: 'value',
  param2: 42,
});
```

## Command Patterns

### Simple Command

A command that just returns data:

```rust
#[tauri::command]
pub async fn get_data(app: AppHandle) -> Result<Data, AppError> {
    let state = app.state::<AppState>();
    let service = &state.data_service;
    service.get_data().await
}
```

### Command with Parameters

A command that accepts parameters:

```rust
#[tauri::command]
pub async fn create_item(
    app: AppHandle,
    name: String,
    description: Option<String>,
) -> Result<Item, AppError> {
    let state = app.state::<AppState>();
    let service = &state.item_service;
    service.create_item(name, description).await
}
```

### Command with Validation

A command that validates input:

```rust
#[tauri::command]
pub async fn update_item(
    app: AppHandle,
    id: String,
    name: String,
) -> Result<Item, AppError> {
    // Validate input
    if name.is_empty() {
        return Err(AppError::Validation("Name cannot be empty".to_string()));
    }

    let state = app.state::<AppState>();
    let service = &state.item_service;
    service.update_item(id, name).await
}
```

## Error Handling

Commands should return `Result<T, AppError>`:

```rust
#[tauri::command]
pub async fn my_command(app: AppHandle) -> Result<Response, AppError> {
    let result = some_operation().await
        .map_err(|e| AppError::Database(e.to_string()))?;
    Ok(result)
}
```

## Best Practices

1. **Delegate to Services**: Commands should delegate to service layer
2. **Validate Input**: Validate parameters before processing
3. **Handle Errors**: Return appropriate error types
4. **Use Async**: Commands should be async for I/O operations
5. **Type Safety**: Use typed parameters and return values
