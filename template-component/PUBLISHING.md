# Publishing from CI

The package is versioned with Changesets and released from `v<version>` tags.
When a reviewed version PR merges to `main`, the version workflow tags the
commit that set the new version and starts
[`release.yml`](.github/workflows/release.yml) on that tag. The release builds
and tests that exact commit, then stages the tested package on npm with trusted
publishing. A maintainer reviews the staged package on npm and approves it with
2FA.

## Setup

Before the first release, replace the template npm package name and GitHub
repository with your own, and confirm `package.json` repository metadata matches
the GitHub repository. Then:

- If the package isn't on npm yet, publish its first version yourself, since npm
  can only configure trusted publishing and staging for an existing package:

  ```sh
  npm run build && npm publish --access public
  ```

- Register stage-only npm trusted publishing for `release.yml`:

  ```sh
  npm trust github @example/sample-component --repo example-org/sample-component --file release.yml --allow-stage-publish
  ```

- Allow GitHub Actions to create pull requests, for the Changesets version PR.
- Require the always-running `Test and lint` check on `main`. GitHub asks a
  maintainer to approve workflow runs on bot-created version PRs before that
  check can complete.

## Releasing another commit

To release a commit other than the one CI tags, such as a prerelease from a
branch, tag it yourself:

```sh
gh api repos/example-org/sample-component/git/refs -f ref=refs/tags/v1.2.3 -f sha=<commit>
```

The tag must match `package.json`'s version, and stable releases must be on
`main`. The first prerelease identifier selects the npm channel, such as
`alpha`.

## Recovery

The tag records intent to release; npm is the source of truth for what was
staged. If the workflow fails, check npm's staged packages first:

- Tagged, but Release didn't start: start it on the tag with
  `gh workflow run release.yml -R example-org/sample-component --ref v1.2.3`.
- Not staged: rerun the failed jobs
  (`gh run rerun <run-id> -R example-org/sample-component --failed`). A rerun
  uses the run's original commit and works for 30 days. To release a different
  commit, fix the source and move the tag:

  ```sh
  gh api -X PATCH repos/example-org/sample-component/git/refs/tags/v1.2.3 -f sha=<commit> -F force=true
  ```

- Staged, but rejected in review: `npm stage reject <stage-id>` frees the
  version, so you can move the tag to a corrected commit. A published version
  cannot be reused; prepare a new version instead.
