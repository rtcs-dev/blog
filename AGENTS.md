# Registry items

A registry item is one folder, `apps/web/registry/<name>/`.

- `<name>.tsx` or `<name>.ts` is the installable source, listed in `apps/web/registry.json`.
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
