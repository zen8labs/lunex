---
sidebar_position: 2
---

# Atoms

Atoms are the basic building blocks of the UI. They are simple, reusable components with no business logic.

## Available Atoms

### Button

Primary button component with variants.

**Location:** `src/ui/atoms/button/button.tsx`

**Props:**

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Usage:**

```typescript
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

### Input

Text input field.

**Location:** `src/ui/atoms/input.tsx`

**Props:**

```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password';
}
```

### Card

Card container component.

**Location:** `src/ui/atoms/card.tsx`

**Props:**

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
```

### Dialog

Modal dialog system.

**Location:** `src/ui/atoms/dialog/`

**Components:**

- `Dialog` - Main dialog component
- `DialogTrigger` - Trigger button
- `DialogContent` - Dialog content
- `DialogHeader` - Dialog header
- `DialogFooter` - Dialog footer

**Usage:**

```typescript
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>Title</DialogHeader>
    Content here
  </DialogContent>
</Dialog>
```

## Complete Atom List

See [Component Inventory](../../project-documentation/component-inventory.md) for a complete list of all atoms.

## Rules for Atoms

1. **No Business Logic**: Atoms should be pure presentational components
2. **No Tauri API Calls**: Atoms should not directly call Tauri APIs
3. **No Redux**: Atoms should not use Redux directly
4. **Reusable**: Atoms should be reusable across the application
5. **Type Safe**: All props should be typed with TypeScript
