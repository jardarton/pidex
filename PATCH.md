# Fork patches

This file is the durable record of changes that belong to `pidex` rather than
[`upstream`](https://github.com/IgorWarzocha/howaboua-pi-stuff). After replacing
`packages/pi-codex-conversion` with a fresh upstream copy, reapply every active
patch below.

See [UPSTREAM.md](UPSTREAM.md) for the upstream revision and synchronization
procedure. Upstream fixes that are copied here unchanged do not belong in this
file.

## Workflow

For every fork-only change:

1. Add an entry to **Active patches** in the same commit as the implementation.
2. Keep the implementation as standalone as practical: prefer new fork-owned
   modules with narrow integration hooks over broad edits to upstream files.
3. Record the purpose, affected files, exact behavior, reapplication steps, and
   verification commands. Do not rely only on a commit hash or an old diff.
4. Add or update focused tests where practical.
5. After an upstream refresh, work through the entries in order and adapt them
   to the new upstream implementation rather than blindly applying old hunks.
6. Remove an entry when upstream provides the behavior or the fork no longer
   needs it.

Suggested entry:

```markdown
### Short patch name

- **Status:** Active
- **Purpose:** Why this fork differs from upstream.
- **Files:** Paths or areas expected to change.
- **Behavior:** The user-visible and implementation requirements to preserve.
- **Reapply:** Concrete steps for recreating the change on fresh upstream code.
- **Verify:** Focused tests or manual checks.
- **Added:** Fork commit, if available.
```

## Refresh checklist

1. Follow the replacement procedure in [UPSTREAM.md](UPSTREAM.md).
2. Reapply each active patch below in listed order.
3. Regenerate `bun.lock` if package metadata changed.
4. Run `bun run check` plus every patch-specific verification step.
5. Update the upstream revision in `UPSTREAM.md` and commit the refresh,
   reapplied patches, and documentation together.

## Active patches

### Notify ntfy when LAN voice starts

- **Status:** Active
- **Purpose:** Send a mobile notification containing the LAN voice URLs whenever
  a new LAN voice server starts successfully.
- **Files:** The standalone notifier is
  `packages/pi-codex-conversion/src/voice/lan/ntfy.ts`; the only upstream hook is
  in `packages/pi-codex-conversion/src/voice/lan/controller.ts`; focused tests
  are in `packages/pi-codex-conversion/tests/voice-lan-ntfy.test.ts`.
- **Behavior:** When `PI_CODEX_LAN_VOICE_NTFY_URL` contains a complete ntfy topic
  URL, send a best-effort notification with all LAN URLs and make the first URL
  clickable. Use `PI_CODEX_LAN_VOICE_NTFY_TOKEN` as an optional bearer token.
  Disabled or failed notification delivery must not prevent server startup;
  failures produce a warning in Pi.
- **Reapply:** Restore `ntfy.ts` and its test, then import and call
  `notifyLanVoiceStarted(server.urls)` after successful startup in the LAN
  controller. Keep the call asynchronous and handle its rejection as a warning.
- **Verify:** Run
  `bun test packages/pi-codex-conversion/tests/voice-lan-ntfy.test.ts`, then
  `bun run check`. Start LAN voice with a test topic configured and confirm the
  notification opens the first advertised URL.

### Exclude Windows native binaries

- **Status:** Active
- **Purpose:** This fork targets Linux and macOS and avoids carrying unused
  Windows binary artifacts.
- **Files:** Any files under
  `packages/pi-codex-conversion/**/bin/win32-arm64/` and
  `packages/pi-codex-conversion/**/bin/win32-x64/`.
- **Behavior:** No committed Windows native-tool or voice-helper binaries are
  present. Linux and macOS binaries remain unchanged.
- **Reapply:** After copying the package from upstream, run:

  ```bash
  find packages/pi-codex-conversion -path '*/bin/win32-*' -type f -delete
  find packages/pi-codex-conversion -type d -name 'win32-*' -empty -delete
  git add -A packages/pi-codex-conversion
  ```

- **Verify:** `git ls-files 'packages/pi-codex-conversion/**/bin/win32-*'`
  prints nothing. `bun run typecheck` and `bun run test` still pass. The
  all-platform `verify:codex-tool-binaries` publishing check is expected to fail
  until its platform list is made fork-aware.
- **Added:** `94e8081` (`Remove the Windows binaries`).

## Repository-only adaptations

These files support the extracted, single-package repository and are outside
the package directory replaced during an upstream refresh. Keep them, but
review them when upstream changes workspace tooling:

- `package.json` contains the reduced workspace scripts and dependencies.
- `knip.jsonc` checks only `@howaboua/pi-codex-conversion`.
- `bun.lock` is pruned to this repository's workspace.
- `README.md`, `UPSTREAM.md`, and this file document the fork.
- Root `AGENTS.md` requires package-manager dependency security controls to
  remain enabled.
