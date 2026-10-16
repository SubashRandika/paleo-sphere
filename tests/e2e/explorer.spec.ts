import { expect, test } from "@playwright/test";

test("the strata rail moves between species without a full page load", async ({ page }) => {
  await page.goto("/species/tyrannosaurus-rex");
  // Survives client-side navigation, but not a document reload.
  await page.evaluate(() => ((window as unknown as { __spa: boolean }).__spa = true));

  const rail = page.getByRole("navigation", { name: "Species by geological age" }).locator("visible=true");
  await expect(rail.getByRole("link", { name: /Tyrannosaurus rex/ })).toHaveAttribute("aria-current", "page");

  await rail.getByRole("link", { name: /Stegosaurus stenops/ }).click();
  await expect(page).toHaveURL(/\/species\/stegosaurus-stenops$/);
  await expect(page.getByRole("heading", { level: 1, name: "Stegosaurus stenops" })).toBeVisible();
  await expect(page).toHaveTitle("Stegosaurus stenops · Paleo Sphere");
  await expect(rail.getByRole("link", { name: /Stegosaurus stenops/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(await page.evaluate(() => (window as unknown as { __spa?: boolean }).__spa)).toBe(true);

  // Back returns to the T. rex viewer.
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1, name: "Tyrannosaurus rex" })).toBeVisible();
  await expect(page.locator('[data-viewer-state="ready"]')).toBeVisible({ timeout: 30_000 });
});

test("anatomy mode shows hotspots whose notes cite the page's sources", async ({ page }) => {
  await page.goto("/species/tyrannosaurus-rex");
  await expect(page.locator('[data-viewer-state="ready"]')).toBeVisible({ timeout: 30_000 });

  await page.getByRole("button", { name: "Anatomy" }).click();
  await expect(page.getByRole("button", { name: "Anatomy" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Select a numbered point to read about it")).toBeVisible();

  await page.getByRole("button", { name: "2. Sense of smell" }).click();
  const note = page.getByRole("region", { name: "Sense of smell" });
  await expect(note).toBeVisible();
  await expect(note).toContainText("Strong inference");
  const source = note.getByRole("link", { name: /^Source \d+$/ }).first();
  await expect(page.locator((await source.getAttribute("href"))!)).toContainText("Brochu");

  await page.keyboard.press("Escape");
  await expect(note).toBeHidden();

  await page.getByRole("button", { name: "Studio" }).click();
  await expect(page.getByRole("button", { name: /^\d\. / })).toHaveCount(0);
});

test("the home page filters species by period, diet and name", async ({ page }) => {
  await page.goto("/");
  const results = page.getByRole("region", { name: /Species/ }).getByRole("listitem");
  await expect(results).toHaveCount(5);

  await page.getByRole("button", { name: "Cretaceous" }).click();
  await expect(results).toHaveCount(2);
  await page.getByRole("button", { name: "Plant-eater" }).click();
  await expect(results).toHaveCount(1);
  await expect(results.first()).toContainText("Triceratops horridus");

  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("searchbox").fill("mamen");
  await expect(results).toHaveCount(1);
  await results.first().getByRole("link").click();
  await expect(page).toHaveURL(/\/species\/mamenchisaurus$/);
});

test("without JavaScript every species is listed and filters are not shown", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("region", { name: /Species/ }).getByRole("listitem")).toHaveCount(5);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await context.close();
});
