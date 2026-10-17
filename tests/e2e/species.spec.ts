import { expect, test } from "@playwright/test";

test("home page lists species and links to a species page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Tyrannosaurus rex/ }).click();

  await expect(page).toHaveURL(/\/species\/tyrannosaurus-rex$/);
  await expect(page.getByRole("heading", { level: 1, name: "Tyrannosaurus rex" })).toBeVisible();
});

test("species page has a title, canonical URL, and model attribution", async ({ page }) => {
  await page.goto("/species/tyrannosaurus-rex");

  await expect(page).toHaveTitle("Tyrannosaurus rex · Paleo Sphere");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/species\/tyrannosaurus-rex$/,
  );
  await expect(page.getByRole("link", { name: "CC BY 4.0" })).toBeVisible();
});

test("species text is in the server HTML, not rendered by client JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/species/tyrannosaurus-rex");

  await expect(page.getByRole("heading", { level: 1, name: "Tyrannosaurus rex" })).toBeVisible();
  // The whole evidence article, including collapsed sections and sources, is plain HTML.
  await expect(page.getByRole("heading", { name: "What scientists know" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  await expect(page.locator("#source-bell-2017")).toContainText("Tyrannosauroid integument");
  await context.close();
});

test("home page lists all five species, each with its model", async ({ page }) => {
  await page.goto("/");
  const list = page.getByRole("region", { name: "Species" }).getByRole("listitem");
  await expect(list).toHaveCount(5);
  await expect(page.getByText("3D model in preparation")).toHaveCount(0);
});

for (const slug of [
  "triceratops-horridus",
  "stegosaurus-stenops",
  "allosaurus-fragilis",
  "mamenchisaurus",
  "tyrannosaurus-rex",
]) {
  test(`${slug}: the model loads without errors`, async ({ page }) => {
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(String(error)));
    page.on("console", (message) => {
      if (/GL_INVALID|WebGL: |THREE\.WebGLProgram/.test(message.text())) problems.push(message.text());
    });
    await page.goto(`/species/${slug}`);
    await expect(page.locator("figure[data-viewer-state]")).toHaveAttribute("data-viewer-state", "ready", {
      timeout: 60_000,
    });
    expect(problems).toEqual([]);
  });
}

test("source markers jump to the matching entry in the sources list", async ({ page }) => {
  await page.goto("/species/stegosaurus-stenops");
  const marker = page.getByRole("link", { name: /^Source \d+$/ }).first();
  const target = await marker.getAttribute("href");
  await marker.click();
  await expect(page).toHaveURL(new RegExp(`${target}$`));
  await expect(page.locator(target!)).toBeInViewport();
});

test("published records are offered to search engines", async ({ page }) => {
  await page.goto("/species/tyrannosaurus-rex");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
});

test("unknown species returns 404", async ({ page }) => {
  const response = await page.goto("/species/not-a-dinosaur");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "No specimen with that name" })).toBeVisible();
});

test("keyboard users can skip to the main content", async ({ page }) => {
  await page.goto("/species/tyrannosaurus-rex");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
});
