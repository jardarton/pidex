# Upstream

| | |
| --- | --- |
| Repository | https://github.com/IgorWarzocha/howaboua-pi-stuff |
| Directory | `packages/pi-codex-conversion` |
| Upstream revision | `d577673e4c00892c133e7231eb5423982469531c` (2026-09-03) |
| Package version | `@howaboua/pi-codex-conversion@3.0.25` |

This repository is a snapshot fork. It does not contain the upstream commit history.
The table records the revision used for the most recent package refresh.

## What was copied unchanged

- `packages/pi-codex-conversion/` — all tracked files except the customizations below
- `tsconfig.base.json`
- `LICENSE`
- `.gitignore`
- `bun.lock`
- `scripts/workspaces.mjs`, `scripts/active-packages.mjs`, `scripts/changed-workspaces.mjs`,
  `scripts/check-changed.mjs`, `scripts/build-extension-changelog.mjs`,
  `scripts/verify-pi-extension-artifact.mjs`

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
- `packages/pi-codex-conversion/package.json` omits the browser CDP sync check because its
  source package is not part of this snapshot. `repository`, `homepage`, and `bugs` still
  point at upstream. Change them before you publish this fork to npm.
- The browser CDP entry-point test covers only this package's entry point. The second entry
  point belongs to the omitted `pi-skill-chrome-cdp` package.
- `src/voice/lan/ntfy.ts` and its integration in `src/voice/lan/controller.ts` notify an
  optional ntfy topic when the LAN voice server starts. The behavior is covered by
  `tests/voice-lan-ntfy.test.ts`.
- The 12 Windows binaries (`**/bin/win32-x64/**` and `**/bin/win32-arm64/**`, 39.4 MB) were
  deleted. See below.

## Deleted Windows binaries

This fork targets Linux and macOS only. Every `win32-x64` and `win32-arm64` binary was
removed: 6 tools times 2 architectures, 39.4 MB.

Consequences:

- `bun run verify:codex-tool-binaries` fails, because it requires all 36 binaries. That
  script only runs on `prepublishOnly`, so it does not affect building, testing, or local
  use. Change the `platforms` list in `scripts/verify-codex-tool-binaries.mjs` if you ever
  publish this fork.
- `typecheck` and the test suite are unaffected.
- The `files` globs in `package.json` still name the `bin/**` paths. A glob that matches
  nothing is harmless.
- Nothing rebuilds these. Upstream builds them in a GitHub Actions workflow that this fork
  does not have.

Every upstream sync brings them back, so delete them again after each one:

```bash
find packages/pi-codex-conversion -path '*/bin/win32-*' -type f -delete
find packages/pi-codex-conversion -type d -name 'win32-*' -empty -delete
```

## Getting changes from upstream

```bash
git remote add upstream https://github.com/IgorWarzocha/howaboua-pi-stuff.git   # once
git fetch upstream

# see what changed in the package since the last refresh, ignoring binary churn
git diff fa39a62..upstream/main \
  -- packages/pi-codex-conversion ':(exclude)packages/pi-codex-conversion/**/bin/**'
```

Upstream rebuilds and commits all 36 binaries on most releases, so excluding them removes
the largest source of diff noise. `git apply` also fails on a hunk that modifies a Windows
binary this fork deleted, so the exclusion is required, not only convenient.

Replacing the directory is more reliable than applying a patch, because it cannot conflict:

```bash
git rm -r --cached packages/pi-codex-conversion
rm -rf packages/pi-codex-conversion
git archive upstream/main packages/pi-codex-conversion | tar -x
find packages/pi-codex-conversion -path '*/bin/win32-*' -type f -delete
find packages/pi-codex-conversion -type d -name 'win32-*' -empty -delete
git add -A packages/pi-codex-conversion
git status
```

After a sync:

1. Write the new upstream commit into the table above.
2. Check whether `src/voice/rust/`, `src/tools/**/rust/`, or any `Cargo.lock` moved. If so,
   rebuild whatever consumes them.
3. Run `bun install && bun run check`.
