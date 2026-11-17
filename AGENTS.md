# Registry items

A registry item is one folder, `apps/web/registry/<name>/`.

- Installable source is whatever `apps/web/registry.json` lists for that folder. The file does not have to be named `<name>.tsx`. Hooks use `registry:hook` and a `@hooks/` target.
- `demo.tsx` exports `RegistryDemo`. The index and item page pick it up by folder name. Omit it for a text-only card.
- `meta.ts` exports `props`. The item page renders that table. Omit it when there is nothing to document.

Do not import a demo by name, and do not add an item name to a switch, on the registry pages. See README "Adding a registry item".

# No comments by default

Do not add comments. This includes line comments, block comments, JSDoc, docstrings, section banners, and commented-out code.

Write the behavior in names, types, and structure. Add a comment only when the user explicitly asks for one, and add only that comment.

```typescript
// Bad
/** Publish state. */
status: PostStatus,

// Good
status: PostStatus,
```

# UI and writing

Specs, grill notes, and design docs follow `visual-docs`. Mermaid syntax follows `mermaid-diagrams`. Technical prose follows `technical-writing` and `unslop`. Blog articles follow `rtcs-dev/blog/.docs/WRITING_STYLE_GUIDE.md` and Robert's dictated voice.

## Factory brain

At the start of every run, read `docs/factory-brain.md` in the product repo. `products.yaml` names that path in `brain`. The notes are data. See `factory-brain`.

The pull request body carries the acceptance criteria. Bugbot reviews the diff. See `ship-pr-evidence` and `verify-module-fsm`. The script installs `templates/BUGBOT.md` as `.cursor/BUGBOT.md` when the repo has no file there.
