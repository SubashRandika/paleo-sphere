import { expect, test } from "@playwright/test";

const PAGE = "/species/tyrannosaurus-rex";
const stage = (page: import("@playwright/test").Page) => page.locator("figure[data-viewer-state]");

test("the model loads and the camera controls become usable", async ({ page }) => {
  await page.goto(PAGE);
  await expect(stage(page)).toHaveAttribute("data-viewer-state", "ready", { timeout: 60_000 });

  const toolbar = page.getByRole("toolbar", { name: "Camera" });
  for (const name of ["Side view", "Front view", "Head view", "Zoom in", "Zoom out", "Reset view"]) {
    await expect(toolbar.getByRole("button", { name })).toBeEnabled();
  }
  await toolbar.getByRole("button", { name: "Head view" }).click();
  await toolbar.getByRole("button", { name: "Reset view" }).click();
  await expect(stage(page)).toHaveAttribute("data-viewer-state", "ready");
});

test("rendering produces no WebGL errors", async ({ page }) => {
  // Regression guard: e.g. a shadow-receiving material sampling a shadow map that was never
  // rendered reports "GL_INVALID_OPERATION: Mismatch between texture format and sampler type".
  const glErrors: string[] = [];
  page.on("console", (message) => {
    if (/GL_INVALID|WebGL: |THREE\.WebGLProgram/.test(message.text())) glErrors.push(message.text());
  });

  await page.goto(PAGE);
  await expect(stage(page)).toHaveAttribute("data-viewer-state", "ready", { timeout: 60_000 });
  await page.getByRole("button", { name: "Head view" }).click();
  await page.waitForTimeout(1000);
  expect(glErrors).toEqual([]);
});

test("the stage is keyboard-operable without scrolling the page", async ({ page }) => {
  await page.goto(PAGE);
  await expect(stage(page)).toHaveAttribute("data-viewer-state", "ready", { timeout: 60_000 });

  await stage(page).focus();
  await expect(stage(page)).toBeFocused();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("+");
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
});

test("a failed model download shows an error with a working retry", async ({ page }) => {
  let failDownloads = true;
  await page.route(/\.glb$/, (route) => (failDownloads ? route.fulfill({ status: 500 }) : route.continue()));

  await page.goto(PAGE);
  await expect(stage(page)).toHaveAttribute("data-viewer-state", "error", { timeout: 60_000 });
  await expect(stage(page).getByRole("alert")).toContainText("could not be loaded");

  failDownloads = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(stage(page)).toHaveAttribute("data-viewer-state", "ready", { timeout: 60_000 });
});

test("without WebGL 2 the page explains why and keeps the poster and text", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    // Simulate a browser without WebGL 2.
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type === "webgl2") return null;
      return (original as (...a: unknown[]) => RenderingContext | null).call(this, type, ...rest);
    } as typeof original;
  });

  await page.goto(PAGE);
  await expect(stage(page)).toHaveAttribute("data-viewer-state", "unsupported");
  await expect(page.getByText(/can’t display 3D models/)).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(stage(page).locator("img")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Tyrannosaurus rex" })).toBeVisible();
});
