import { describe, expect, it, vi } from "vitest";
import { getTemplateRepoPath, isComponentPackage } from "./templateSource";

const presets = ["react-vite", "nextjs"];

describe("getTemplateRepoPath", () => {
  it("uses this repo's templates from main", () => {
    expect(getTemplateRepoPath("react-vite", presets, undefined)).toBe(
      "convex/templates/template-react-vite#main",
    );
  });

  // Asking for main broke every example whose default branch is master.
  it("leaves a GitHub repo on its default branch", () => {
    expect(getTemplateRepoPath("misty-step/linejam", presets, undefined)).toBe(
      "misty-step/linejam",
    );
    expect(
      getTemplateRepoPath("convex/presence/example", presets, undefined),
    ).toBe("convex/presence/example");
  });

  it("keeps a ref the user gave", () => {
    expect(
      getTemplateRepoPath("misty-step/linejam#master", presets, "dev"),
    ).toBe("misty-step/linejam#master");
  });

  it("applies CONVEX_TEMPLATE_BRANCH when it's set", () => {
    expect(getTemplateRepoPath("react-vite", presets, "dev")).toBe(
      "convex/templates/template-react-vite#dev",
    );
    expect(getTemplateRepoPath("someone/app", presets, "dev")).toBe(
      "someone/app#dev",
    );
  });

  it("falls back to an external convex/template-* repo", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    expect(getTemplateRepoPath("something-else", presets, undefined)).toBe(
      "convex/template-something-else#main",
    );
  });
});

describe("isComponentPackage", () => {
  it("spots a Convex component by its convex.config export", () => {
    expect(
      isComponentPackage({
        exports: {
          ".": "./dist/client/index.js",
          "./convex.config.js": "./dist/component/convex.config.js",
        },
      }),
    ).toBe(true);
  });

  it("leaves apps alone", () => {
    expect(isComponentPackage({})).toBe(false);
    expect(isComponentPackage({ exports: "./index.js" })).toBe(false);
    expect(isComponentPackage({ exports: { ".": "./index.js" } })).toBe(false);
  });
});
