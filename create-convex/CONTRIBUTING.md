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
`npx changeset`.

Once your PR is open, add its number in parentheses at the end of the first
paragraph of each changeset, for example `(#279)`.

The **Update release PR** workflow uses pending Changesets to
open a version PR. Review the generated version and changelog against all
changes since the last release. GitHub Actions opens that PR, so click
**Approve workflows to run** if its checks are waiting. Merge it when you want to
release.

When the version PR merges, CI tags the commit that set the new version as
`v<version>` and starts the **Release** workflow on that tag. To release a
different commit, tag it yourself:

```sh
gh api repos/convex/templates/git/refs -f ref=refs/tags/v0.0.48 -f sha=<commit>
```

Or, from a local clone: `git tag v0.0.48 <commit> && git push origin v0.0.48`.

The tag must match `create-convex/package.json`'s version. Stable releases must
be on `main`; the commit may be older than the current tip. GitHub runs the
release workflow from the tagged commit, so the commit must include it. The
workflow builds and checks that commit, then stages the tested package on npm.
Its npm channel follows the version: stable versions use `latest`, and
prereleases such as `0.0.48-alpha.0` use `alpha`. Review the staged package on
npm and approve it with 2FA, or run `npm stage approve <stage-id>` with the
stage ID from the workflow log.

If the workflow fails, check npm's staged packages first:

- Tagged, but Release didn't start: start it on the tag with
  `gh workflow run release.yml -R convex/templates --ref v0.0.48`.
- Not staged: rerun the failed jobs
  (`gh run rerun <run-id> -R convex/templates --failed`), for example after
  pushing `main` if the tag went first. A rerun uses the run's original commit
  and works for 30 days.

  To release a different commit, fix the source and move the tag:

  ```sh
  gh api -X PATCH repos/convex/templates/git/refs/tags/v0.0.48 -f sha=<commit> -F force=true
  ```

- Staged, but rejected in review: `npm stage reject <stage-id>` frees the
  version, so you can move the tag to a corrected commit. A published version
  cannot be reused; prepare a new version instead.
