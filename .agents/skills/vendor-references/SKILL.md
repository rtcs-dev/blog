---
name: vendor-references
description: >-
  Shallow-clones third-party reference repositories into `.vendor/` and keeps a
  committed record of what was cloned. Use when adapting upstream projects,
  studying reference implementations, or when the user mentions `.vendor`,
  vendor clones, or reference repos.
---

# Vendor reference repos

## Rules

1. **Shallow-clone** third-party reference repos into `.vendor/<name>/` at the repo root (e.g. `git clone --depth 1 <url> .vendor/og.new`).
2. **Never commit** clone contents. `.vendor/` is gitignored.
3. **Do commit** the clone record at [`vendor-manifest.json`](../../../vendor-manifest.json) (repo root).

## Workflow

1. Read `vendor-manifest.json` to see what is already recorded.
2. If the repo is missing from `.vendor/`, shallow-clone it there.
3. Upsert an entry in `vendor-manifest.json`:

```json
{
  "repos": [
    {
      "name": "og.new",
      "url": "https://github.com/clerk/og.new",
      "path": ".vendor/og.new",
      "depth": 1,
      "notes": "Reference OG image editor; adapted product lives in apps/og"
    }
  ]
}
```

4. Confirm `git check-ignore -q .vendor` (or `.vendor/`) succeeds and that `git status` does not stage anything under `.vendor/`.

## Notes

- Clones are **reference only**. Adapted product code belongs under `apps/` (or another tracked path), not inside `.vendor/`.
- Prefer `--depth 1` unless history is required.
