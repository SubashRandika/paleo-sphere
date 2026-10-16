import { expect, test } from "@playwright/test";

const background = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test("dark is the default theme", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await background(page)).toBe("rgb(18, 20, 23)");
});

test("the theme toggle switches to light and the choice survives a reload", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/species/tyrannosaurus-rex");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await background(page)).toBe("rgb(230, 225, 214)");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#e6e1d6");

  await page.reload();
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
});

test("a stored light choice is applied before first paint", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("paleo-sphere:theme", "light"));
  // Inspect the document as soon as it is parsed — before any React code has run.
  await page.goto("/", { waitUntil: "commit" });
  const themeAtParse = await page.evaluate(
    () =>
      new Promise<string | undefined>((resolve) => {
        if (document.readyState !== "loading") resolve(document.documentElement.dataset.theme);
        else
          document.addEventListener("DOMContentLoaded", () =>
            resolve(document.documentElement.dataset.theme),
          );
      }),
  );
  expect(themeAtParse).toBe("light");
});
