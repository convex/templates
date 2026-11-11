# Publishing from CI

The package is versioned with Changesets. Merge a reviewed version PR to
`main`; `.github/workflows/release.yml` builds, checks, stages the npm package
with trusted publishing, and tags the source commit after staging succeeds.
A maintainer reviews the staged package on npm and approves it with 2FA.

Before the first release, replace the template npm package name and GitHub
repository with your own. Confirm `package.json` repository metadata matches
the GitHub repository. Register npm trusted publishing for the package's
`release.yml` workflow:

```sh
npm trust github @example/sample-component --repo example-org/sample-component --file release.yml --allow-stage-publish
```

The generated repository must allow GitHub Actions to create pull requests for
the Changesets version workflow, and its main-branch rule should require the
always-running `Test and lint` check. GitHub may require a maintainer to approve
workflow runs on bot-created version PRs before that check can complete.

To prepare a version PR manually, run `npx changeset version`, review its
version and changelog changes, and merge through a checked PR. If a release
fails before staging, dispatch **Release** with the version-bump commit SHA.
If staging might have succeeded, inspect npm before retrying so the same
version is not staged twice. If staging succeeded but tagging failed, verify the
staged package and rerun the failed `tag` job in the original workflow run. The
tag points to the commit that was staged.
