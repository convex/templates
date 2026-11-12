# Build CLI

```sh
cd create-convex
npm run build
```

# Test CLI

```sh
node <path to here>/create-convex/dist/index.mjs
```

with arguments:

```sh
node <path to here>/create-convex/dist/index.mjs -t react-vite-shadcn
```

**Note:** With `npm create` `--` is required:

```sh
npm create convex -- -t react-vite-shadcn
```

# Releases

For a user-visible change, add a Changeset from `create-convex/` with
`npx changeset`. The **Update release PR** workflow uses pending Changesets to
open a version PR. Review the generated version and changelog against all
changes since the last release. Merge that PR only when you want to release.

The **Release** workflow stages the package from the version-bump commit on
`main` after building and checking it. Its npm channel follows the version:
stable versions use `latest`, and prereleases such as `0.0.48-alpha.0` use
`alpha`. After staging succeeds, CI tags that source commit as `v<version>`.
Review the staged package on npm and approve it with 2FA to publish it.

If staging fails, check npm for an existing staged copy before dispatching
**Release** with the version-bump commit SHA. If staging succeeded but tagging
failed, verify the staged package and rerun the failed `tag` job in the
original workflow run. A second staging attempt cannot reuse a reserved
version.
