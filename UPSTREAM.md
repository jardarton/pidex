# Upstream

| | |
| --- | --- |
| Repository | https://github.com/IgorWarzocha/howaboua-pi-stuff |
| Directory | `packages/pi-codex-conversion` |
| Fork point | `6cd01ee8dc0a68f686c86dfb14b43fd601e65074` (2026-08-07) |
| Package version at fork point | `@howaboua/pi-codex-conversion@3.0.10` |

This repository is a snapshot fork. It does not contain the upstream commit history.

## What was copied unchanged

- `packages/pi-codex-conversion/` — all tracked files, byte for byte
- `tsconfig.base.json`
- `LICENSE`
- `.gitignore`
- `bun.lock`
- `scripts/workspaces.mjs`, `scripts/active-packages.mjs`, `scripts/changed-workspaces.mjs`,
  `scripts/check-changed.mjs`, `scripts/verify-pi-extension-artifact.mjs`

## What is different

- The root `package.json` is new. It keeps the bun workspace setup and the
  `typecheck` / `test` / `check` / `pack:dry` scripts, but drops the changesets release
  pipeline and the dependencies that only the other upstream packages needed.
- `knip.jsonc` only lists this package.
- The upstream `.changeset/`, `.githooks/`, `.github/`, `.pi/`, and `docs/` directories were
  not copied.
- This `README.md` and `UPSTREAM.md` are new. The upstream root `README.md`, `AGENTS.md`,
  and `CHANGELOG.md` describe the whole monorepo and were not copied; the package keeps its
  own copies of those files.
- `packages/pi-codex-conversion/package.json` is unchanged, so `repository`, `homepage`, and
  `bugs` still point at upstream. Change them before you publish this fork to npm.

## Getting changes from upstream

```bash
git remote add upstream https://github.com/IgorWarzocha/howaboua-pi-stuff.git   # once
git fetch upstream

# see what changed in the package since the fork point
git diff 6cd01ee8dc0a68f686c86dfb14b43fd601e65074..upstream/main -- packages/pi-codex-conversion
```

Apply the changes with `git apply`, or replace the directory and review the result:

```bash
git rm -r --cached packages/pi-codex-conversion
rm -rf packages/pi-codex-conversion
git archive upstream/main packages/pi-codex-conversion | tar -x
git add packages/pi-codex-conversion
git status
```

After a sync, write the new upstream commit into the table above.
