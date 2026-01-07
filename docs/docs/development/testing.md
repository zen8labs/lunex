---
sidebar_position: 7
---

# Testing

This guide covers testing strategies and practices in Nexo.

## Testing Strategy

### Unit Tests

Test individual functions and components in isolation.

### Integration Tests

Test interactions between components and services.

### End-to-End Tests

Test complete user workflows (when implemented).

## Frontend Testing

### Component Testing

Test React components:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Hook Testing

Test custom hooks:

```typescript
import { renderHook } from '@testing-library/react';
import { useChats } from './useChats';

test('fetches chats', async () => {
  const { result } = renderHook(() => useChats());
  // Test hook behavior
});
```

### Redux Testing

Test Redux slices:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import chatsSlice from './chatsSlice';

test('adds chat', () => {
  const store = configureStore({ reducer: { chats: chatsSlice.reducer } });
  store.dispatch(chatsSlice.actions.addChat(mockChat));
  expect(store.getState().chats.chats).toContain(mockChat);
});
```

## Backend Testing

### Unit Tests

Test individual functions:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_function() {
        let result = my_function("input");
        assert_eq!(result, "expected");
    }
}
```

### Integration Tests

Test service interactions:

```rust
#[tokio::test]
async fn test_service() {
    let service = create_test_service().await;
    let result = service.do_something().await.unwrap();
    assert_eq!(result, expected);
}
```

### Repository Tests

Test database operations:

```rust
#[test]
fn test_repository() {
    let conn = create_test_db();
    let repo = SqliteMyRepository::new(conn);

    let item = MyModel { /* ... */ };
    repo.create(&item).unwrap();

    let retrieved = repo.get_by_id(&item.id).unwrap();
    assert_eq!(retrieved, Some(item));
}
```

## Running Tests

### Frontend Tests

```bash
yarn test
```

### Backend Tests

```bash
cd src-tauri
cargo test
```

### Specific Test

```bash
# Frontend
yarn test Button

# Backend
cargo test test_name
```

## Test Data

### Mock Data

Create mock data for testing:

```typescript
export const mockChat: Chat = {
  id: '123',
  workspace_id: 'workspace-1',
  title: 'Test Chat',
  created_at: Date.now(),
};
```

### Test Database

Use in-memory database for testing:

```rust
let conn = Connection::open_in_memory()?;
run_migrations(&conn)?;
```

## Best Practices

1. **Test Behavior**: Test what components do, not implementation details
2. **Isolate Tests**: Each test should be independent
3. **Use Mocks**: Mock external dependencies
4. **Test Edge Cases**: Test error conditions and edge cases
5. **Keep Tests Fast**: Tests should run quickly
