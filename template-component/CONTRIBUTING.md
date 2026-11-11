# Developing guide

## Running locally

```sh
npm ci
npm run dev
```

## Testing

```sh
npm run build
npm run check
npm run test:e2e
```

The local Convex smoke test runs after the fast checks. If your component needs
secrets, external services, or additional E2E coverage, adapt `test:e2e` and the
CI setup before relying on it for release checks. Commit generated files used
by the tests and release workflow.

## Releases

Add a Changeset for each user-visible package change with `npx changeset`.
Review the generated version PR and its changelog before merging. Approve its
GitHub Actions runs if GitHub requests approval, and wait for `Test and lint`
to pass.
Merging the version PR stages the tested package on npm from its exact commit;
a maintainer reviews and approves it with 2FA. See [PUBLISHING.md](PUBLISHING.md)
for setup and recovery.
