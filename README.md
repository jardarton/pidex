# pidex

A fork of the `@howaboua/pi-codex-conversion` package from
[IgorWarzocha/howaboua-pi-stuff](https://github.com/IgorWarzocha/howaboua-pi-stuff),
extracted into its own repository.

The package itself is in [`packages/pi-codex-conversion`](packages/pi-codex-conversion).
Read its [README](packages/pi-codex-conversion/README.md) for what the extension does
and how to use it.

See [UPSTREAM.md](UPSTREAM.md) for the fork point and the procedure to get changes from
upstream.

## Layout

The upstream monorepo layout is kept, because the package refers to files above its own
directory (`../../tsconfig.base.json` and `../../scripts/verify-pi-extension-artifact.mjs`).
Keeping the layout makes the package directory identical to upstream, so diffs and merges
stay clean.

```
package.json                     workspace root (bun workspaces)
tsconfig.base.json               shared compiler options, copied from upstream
knip.jsonc                       knip config, trimmed to this one package
scripts/                         only the workspace scripts this package needs
packages/pi-codex-conversion/    the package, unchanged from upstream
```

## Commands

```bash
bun install

bun run typecheck   # tsc for the package
bun run test        # package tests
bun run check       # typecheck + test + knip
```

## License

MIT, the same as upstream. See [LICENSE](LICENSE).
