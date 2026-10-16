import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from "./theme";

// The init script runs as an inline <script> before React exists; run the same string here.
const runInitScript = () => new Function(THEME_INIT_SCRIPT)();

describe("THEME_INIT_SCRIPT", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "dark";
    localStorage.clear();
  });
  afterEach(() => vi.restoreAllMocks());

  it("applies a stored light choice", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    runInitScript();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("keeps the server default when nothing valid is stored", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "sepia");
    runInitScript();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("never throws when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(runInitScript).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
