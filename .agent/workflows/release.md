---
description: Create and push a new release tag (alpha, beta, rc, patch, minor, major)
---

Follow these steps to release a new version of Nexo:

1. **Decide on the new version**
   - **Patch**: `v0.1.0` -> `v0.1.1` (bug fixes)
   - **Minor**: `v0.1.0` -> `v0.2.0` (new features, no breaking changes)
   - **Major**: `v0.1.0` -> `v1.0.0` (breaking changes)
   - **Alpha/Beta/RC**: `v0.1.0-alpha.1`, `v0.1.0-beta.2`, etc.

2. **Update version in all project files**
   Ensure all files are in sync:
   - `src-tauri/Cargo.toml` (`[package] version = "..."`)
   - `package.json` (`"version": "..."`)
   - `src-tauri/tauri.conf.json` (`"version": "..."`)

3. **Create Changelog entry**
   Create a new file in `changelogs/` named `<version>.md` documenting the changes.
   Include sections for Features, Fixes, and Improvements.

4. **Commit changes**
   // turbo
   `git add src-tauri/Cargo.toml package.json src-tauri/tauri.conf.json changelogs/`
   // turbo
   `git commit -m "chore(release): <version>"`

5. **Create Git tag**
   // turbo
   `git tag <version>`

6. **Push commit and tag**
   // turbo
   `git push origin main`
   // turbo
   `git push origin <version>`

Note: Replace `<version>` with the actual version string (e.g., `0.1.0-beta.1`).
