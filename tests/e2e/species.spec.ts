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
  await context.close();
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
