import { expect, test } from "@playwright/test";

test("mock checkout happy path", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /creator-token checkout links/i })).toBeVisible();

  await page.getByRole("link", { name: "Create checkout" }).click();
  await expect(page.getByRole("heading", { name: /create a token-powered checkout link/i })).toBeVisible();

  await page.getByRole("link", { name: "Open generated checkout" }).click();
  await expect(page.getByRole("heading", { name: "Creator Launch Room Pass" })).toBeVisible();

  await page.getByRole("link", { name: "Simulate payment" }).click();
  await expect(page.getByRole("heading", { name: "Payment confirmed" })).toBeVisible();

  await page.getByRole("link", { name: "Creator dashboard" }).click();
  await expect(page.getByRole("heading", { name: /orders and revenue/i })).toBeVisible();
});