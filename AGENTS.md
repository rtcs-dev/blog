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
