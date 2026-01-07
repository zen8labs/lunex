---
sidebar_position: 6
---

# Database Development

This guide covers database development in Nexo, including migrations and data access patterns.

## Database Overview

- **Type:** SQLite (local-first, embedded)
- **Location:** OS app data directory
- **Migration System:** Manual migrations in `src-tauri/src/db/migrations.rs`

## Migrations

### Creating a Migration

Edit `src-tauri/src/db/migrations.rs`:

```rust
pub fn run_migrations(conn: &Connection) -> Result<()> {
    // Existing migrations
    conn.execute("CREATE TABLE IF NOT EXISTS existing_table (...)", [])?;

    // New migration
    conn.execute(
        "CREATE TABLE IF NOT EXISTS new_table (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            created_at INTEGER NOT NULL
        )",
        [],
    )?;

    Ok(())
}
```

### Adding a Column

Use `ALTER TABLE` with `.ok()` to ignore if column already exists:

```rust
conn.execute(
    "ALTER TABLE existing_table ADD COLUMN new_column TEXT",
    [],
).ok(); // .ok() ignores error if column already exists
```

### Creating an Index

```rust
conn.execute(
    "CREATE INDEX IF NOT EXISTS idx_table_column ON table(column)",
    [],
)?;
```

## Repository Pattern

### Creating a Repository

1. Define trait in `src-tauri/src/repositories/`:

```rust
pub trait MyRepository: Send + Sync {
    fn create(&self, item: &MyModel) -> Result<(), AppError>;
    fn get_by_id(&self, id: &str) -> Result<Option<MyModel>, AppError>;
    fn list(&self) -> Result<Vec<MyModel>, AppError>;
    fn update(&self, item: &MyModel) -> Result<(), AppError>;
    fn delete(&self, id: &str) -> Result<(), AppError>;
}
```

2. Implement trait:

```rust
pub struct SqliteMyRepository {
    conn: Arc<Mutex<Connection>>,
}

impl MyRepository for SqliteMyRepository {
    fn create(&self, item: &MyModel) -> Result<(), AppError> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO my_table (id, name, created_at) VALUES (?1, ?2, ?3)",
            params![item.id, item.name, item.created_at],
        )?;
        Ok(())
    }

    fn get_by_id(&self, id: &str) -> Result<Option<MyModel>, AppError> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT * FROM my_table WHERE id = ?1")?;
        let item = stmt.query_row(params![id], |row| {
            Ok(MyModel {
                id: row.get(0)?,
                name: row.get(1)?,
                created_at: row.get(2)?,
            })
        }).optional()?;
        Ok(item)
    }

    // ... other methods
}
```

## Database Queries

### SELECT Query

```rust
let mut stmt = conn.prepare("SELECT * FROM table WHERE id = ?1")?;
let result = stmt.query_row(params![id], |row| {
    Ok(Model {
        id: row.get(0)?,
        name: row.get(1)?,
    })
})?;
```

### INSERT Query

```rust
conn.execute(
    "INSERT INTO table (id, name) VALUES (?1, ?2)",
    params![id, name],
)?;
```

### UPDATE Query

```rust
conn.execute(
    "UPDATE table SET name = ?1 WHERE id = ?2",
    params![new_name, id],
)?;
```

### DELETE Query

```rust
conn.execute("DELETE FROM table WHERE id = ?1", params![id])?;
```

## Foreign Keys

Nexo uses foreign keys with CASCADE deletes:

```sql
CREATE TABLE child_table (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES parent_table(id) ON DELETE CASCADE
);
```

## Transactions

Use transactions for multiple operations:

```rust
let tx = conn.transaction()?;
tx.execute("INSERT INTO table1 ...", [])?;
tx.execute("INSERT INTO table2 ...", [])?;
tx.commit()?;
```

## Best Practices

1. **Use Parameters**: Always use parameterized queries to prevent SQL injection
2. **Handle Errors**: Properly handle database errors
3. **Use Transactions**: Use transactions for multiple related operations
4. **Index Frequently Queried Columns**: Add indexes for performance
5. **Normalize Data**: Keep data normalized to avoid redundancy
