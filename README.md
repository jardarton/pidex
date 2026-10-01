# pidex

A snapshot fork of three independently loadable Codex extensions from
[IgorWarzocha/howaboua-pi-stuff](https://github.com/IgorWarzocha/howaboua-pi-stuff).

| Package | Purpose | Pi extension entry point |
| --- | --- | --- |
| [`pi-codex-conversion`](packages/pi-codex-conversion/README.md) | Codex provider, tools, Code/Notebook modes | `packages/pi-codex-conversion/dist/index.js` |
| [`pi-codex-imagegen`](packages/pi-codex-imagegen/README.md) | Image generation and editing | `packages/pi-codex-imagegen/index.ts` |
| [`pi-codex-web-run`](packages/pi-codex-web-run/README.md) | Web search and navigation | `packages/pi-codex-web-run/index.ts` |

These are separate workspace packages, not one extension. A consumer flake or Pi
profile can select any subset from the same pinned repository source. Each package
must retain its runtime dependencies; conversion must also be built before loading.
Imagegen and web-run work without conversion and optionally integrate with its
Code/Notebook modes when loaded together. Adding these packages here does not
automatically enable them in consumer profiles or add Nix flake outputs.

See [UPSTREAM.md](UPSTREAM.md) for the current upstream revision and the procedure to get changes from
upstream. Fork-only behavior and the steps for recreating it are tracked in
[PATCH.md](PATCH.md).

## Layout

The upstream monorepo layout is kept, because the package refers to files above its own
directory (`../../tsconfig.base.json` and `../../scripts/verify-pi-extension-artifact.mjs`).
Keeping the layout makes the package directory identical to upstream, so diffs and merges
stay clean.

```
package.json                     workspace root (bun workspaces)
tsconfig.base.json               shared compiler options, copied from upstream
knip.jsonc                       knip config for the three packages
scripts/                         shared workspace scripts
packages/pi-codex-conversion/    conversion extension (with fork patches)
packages/pi-codex-imagegen/      independent image generation extension
packages/pi-codex-web-run/       independent web search extension
```

## Commands

```bash
bun install

bun run typecheck   # all three packages
bun run test        # all three packages
bun run check       # package checks + knip

# Check an individual package:
bun run --filter '@howaboua/pi-codex-imagegen' check
```

## License

MIT, the same as upstream. See [LICENSE](LICENSE).
