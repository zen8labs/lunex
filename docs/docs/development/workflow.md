---
sidebar_position: 2
---

# Development Workflow

This guide covers the typical development workflow for contributing to Nexo.

## Code Organization

### Frontend Structure

```
src/
├── ui/              # UI components (Atomic Design)
├── hooks/           # Custom React hooks
├── store/           # Redux store and slices
├── lib/             # Utility libraries
├── i18n/            # Internationalization
└── ...
```

### Backend Structure

```
src-tauri/src/
├── commands/        # Tauri commands (API layer)
├── services/        # Business logic
├── repositories/    # Data access
├── models/          # Data structures
└── ...
```

## Adding a New Feature

### 1. Plan the Feature

- Define requirements
- Identify affected components
- Plan database changes (if needed)
- Design API endpoints

### 2. Create Database Migration (if needed)

Edit `src-tauri/src/db/migrations.rs`:

```rust
pub fn run_migrations(conn: &Connection) -> Result<()> {
    // Add new table or column
    conn.execute("CREATE TABLE IF NOT EXISTS new_table (...)", [])?;
    Ok(())
}
```

### 3. Create Models (if needed)

Create model in `src-tauri/src/models/`:

```rust
pub struct NewModel {
    pub id: String,
    pub name: String,
}
```

### 4. Create Repository

Create repository in `src-tauri/src/repositories/`:

```rust
pub trait NewRepository: Send + Sync {
    fn create(&self, model: &NewModel) -> Result<(), AppError>;
    fn get_by_id(&self, id: &str) -> Result<Option<NewModel>, AppError>;
}
```

### 5. Create Service

Create service in `src-tauri/src/services/`:

```rust
pub struct NewService {
    repository: Arc<dyn NewRepository>,
}

impl NewService {
    pub async fn create(&self, name: String) -> Result<NewModel, AppError> {
        // Business logic
    }
}
```

### 6. Create Command

Create command in `src-tauri/src/commands/`:

```rust
#[tauri::command]
pub async fn create_new(
    app: AppHandle,
    name: String,
) -> Result<NewModel, AppError> {
    let state = app.state::<AppState>();
    let service = &state.new_service;
    service.create(name).await
}
```

### 7. Register Command

Add to `src-tauri/src/lib.rs`:

```rust
.invoke_handler(tauri::generate_handler![
    // ... other commands
    commands::new_feature::create_new,
])
```

### 8. Add Command Constant

Add to `src-tauri/src/constants/commands.rs`:

```rust
impl TauriCommands {
    pub const CREATE_NEW: &'static str = "create_new";
}
```

### 9. Regenerate TypeScript Bindings

```bash
yarn gen:bindings
```

### 10. Create Frontend Hook

Create hook in `src/hooks/`:

```typescript
export function useNewFeature() {
  const dispatch = useAppDispatch();

  const create = async (name: string) => {
    const result = await invokeCommand(TauriCommands.CREATE_NEW, { name });
    // Update Redux state
    return result;
  };

  return { create };
}
```

### 11. Create UI Component

Create component following Atomic Design principles:

```typescript
export function NewFeatureComponent() {
  const { create } = useNewFeature();
  // Component implementation
}
```

## Testing

### Frontend Tests

```bash
yarn test
```

### Backend Tests

```bash
cd src-tauri
cargo test
```

## Code Style

### TypeScript/JavaScript

- **Linter:** ESLint
- **Formatter:** Prettier

```bash
yarn lint
yarn format
```

### Rust

- **Formatter:** rustfmt
- **Linter:** Clippy

```bash
yarn format:rust
yarn lint:rust
```

## Git Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes

Make your changes following the workflow above.

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 4. Push and Create PR

```bash
git push origin feature/my-feature
```

Then create a Pull Request on GitHub.

## Common Tasks

### Adding a New UI Component

1. Create component file in appropriate directory (`atoms/`, `molecules/`, `organisms/`)
2. Follow Atomic Design principles
3. Add TypeScript types
4. Export from module
5. Use in parent component

### Adding a New Redux Slice

1. Create slice file in `src/store/slices/`
2. Define state interface
3. Create slice with `createSlice`
4. Export actions and reducer
5. Add to store in `src/store/index.ts`

### Adding a New Service

1. Create service file in `src-tauri/src/services/`
2. Define service struct with dependencies
3. Implement methods
4. Add to `AppState` in `src-tauri/src/state/app_state.rs`
5. Use in commands or other services
