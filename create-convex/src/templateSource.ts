// Where a template comes from, and what to do with its package.json once it's
// downloaded. Kept apart from index.ts, which starts the CLI when imported,
// so these can be tested.

// E.g. `convex/templates/template-nextjs-convexauth#main`
// or `atrakh/one-million-checkboxes`
export function getTemplateRepoPath(
  templateName: string,
  templatesInRepo: string[],
  // CONVEX_TEMPLATE_BRANCH, for working on the templates in this repo.
  branchOverride: string | undefined,
) {
  const branch = branchOverride || "main";

  // Does this look like a repo name already?
  if (templateName.includes("/")) {
    if (templateName.includes("#") || !branchOverride) {
      // With no #ref, degit fetches the repo's default branch. Plenty of
      // repos still use master, so asking for main would fail to download.
      return templateName;
    }
    return templateName + `#${branch}`;
  }

  if (templatesInRepo.includes(templateName)) {
    return `convex/templates/template-${templateName}#${branch}`;
  }

  // This is one of our templates specifically for `npm create convex`
  // These are annoying to maintain, let's move the ones we care about to this repo.
  const external = `convex/template-${templateName}#${branch}`;
  console.log(
    `Can't find template ${templateName} in create-convex repo, using external repo: ${external}`,
  );
  return external;
}

// A Convex component's own repo (convex/aggregate, convex/presence...) has an
// example app that imports the component by its package name, through the
// package's `./convex.config` export. Renaming the package to the new
// project's name would leave those imports pointing at nothing.
export function isComponentPackage(pkg: { exports?: unknown }) {
  const exports = pkg.exports;
  return (
    typeof exports === "object" &&
    exports !== null &&
    Object.keys(exports).some((key) => key.startsWith("./convex.config"))
  );
}
