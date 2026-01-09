---
trigger: always_on
description: Common rules and guidelines for all workflows
---

# Common Workflow Rules

> [!IMPORTANT]
> These rules apply to ALL workflows. Read this before using any workflow.

## Communication Rules

1. **Language**: Always respond in Vietnamese
2. **No Emojis**: Never use emojis in responses
3. **Clear and Direct**: Be clear, direct, and goal-oriented
4. **Technical Terms**: Use English for:
   - Source code
   - Variable names
   - Function names
   - File names
   - Comments in code
   - Technical terms when Vietnamese equivalent is ambiguous

## Code Quality Rules

1. **Follow Project Standards**
   - Read and follow `.agent/rules/coding.md` strictly
   - Maintain consistency with existing code
   - Use proper naming conventions

2. **Type Safety**
   - No `any` types unless absolutely necessary
   - Always add proper TypeScript types
   - Document any `any` usage with comments

3. **Error Handling**
   - Always handle errors explicitly
   - Use proper error types (AppError for Rust)
   - Never swallow errors silently

4. **Documentation**
   - Add comments for complex logic
   - Update documentation when changing behavior
   - Use English for all code comments

## Verification Requirements (MANDATORY)

All workflows that modify code MUST run these verifications:

### Frontend (TypeScript/React)

1. **Linting**
   // turbo

   ```bash
   yarn lint --fix
   ```

   - Auto-fixes formatting issues
   - Must pass without errors

2. **Type Checking**
   // turbo

   ```bash
   yarn typecheck
   ```

   - Must pass with zero errors
   - No `any` types without comments

3. **Runtime Check**
   - Check browser console for errors
   - Verify UI renders correctly
   - Test all affected features

### Backend (Rust)

1. **Compilation**
   // turbo

   ```bash
   cd src-tauri && cargo check --no-default-features
   ```

   - Must compile without errors

2. **Linting**
   // turbo

   ```bash
   cd src-tauri && cargo clippy
   ```

   - Address all warnings or document why acceptable

3. **Tests (if available)**
   // turbo
   ```bash
   cd src-tauri && cargo test
   ```

### Verification Checklist

- [ ] Linting passes
- [ ] Type checking passes
- [ ] No console errors
- [ ] All features work correctly
- [ ] No performance regressions
- [ ] Code follows project conventions
