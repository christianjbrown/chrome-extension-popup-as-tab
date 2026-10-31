import manifest from "../static/manifest.json";

describe("manifest", () => {
  // Moving a tab and reading which tab opened it need no permission at all.
  // Nothing here reads a page, a URL or a title.
  it("asks for no permissions", () => {
    expect(manifest).not.toHaveProperty("permissions");
    expect(manifest).not.toHaveProperty("host_permissions");
    expect(manifest).not.toHaveProperty("optional_permissions");
  });

  // It is a background behaviour: always on, nothing to click or configure.
  it("has no toolbar button, options page or keyboard shortcut", () => {
    expect(manifest).not.toHaveProperty("action");
    expect(manifest).not.toHaveProperty("options_page");
    expect(manifest).not.toHaveProperty("options_ui");
    expect(manifest).not.toHaveProperty("commands");
  });
});
