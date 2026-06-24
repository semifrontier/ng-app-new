import { expect, type Page, test } from "@playwright/test";

const TOOL_ROUTE = "/tools/campaign-url-architect";

async function fillField(page: Page, name: string, value: string) {
  await page.locator(`input[name="${name}"]`).fill(value);
}

test.describe("Campaign URL Architect", () => {
  test("generates GA4-ready core UTM parameters", async ({ page }) => {
    await page.goto(TOOL_ROUTE, { waitUntil: "domcontentloaded" });

    await fillField(
      page,
      "websiteUrl",
      "https://example.com/path?existing=1&utm_name=old&utm_medium=banner#details",
    );
    await fillField(page, "campaignSource", "Newsletter");
    await fillField(page, "campaignMedium", "Email");
    await fillField(page, "campaignName", "Summer Sale 2026");
    await fillField(page, "campaignContent", "Hero Link");

    const output = page.getByPlaceholder("Tagged URL will appear here...");
    await expect(output).toHaveValue(
      "https://example.com/path?existing=1&utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale_2026&utm_content=hero_link#details",
    );

    const taggedUrl = new URL(await output.inputValue());
    expect(taggedUrl.searchParams.get("utm_campaign")).toBe("summer_sale_2026");
    expect(taggedUrl.searchParams.get("utm_source")).toBe("newsletter");
    expect(taggedUrl.searchParams.get("utm_medium")).toBe("email");
    expect(taggedUrl.searchParams.has("utm_name")).toBe(false);
    expect(taggedUrl.hash).toBe("#details");
  });

  test("blocks nonstandard media and custom overrides", async ({ page }) => {
    await page.goto(TOOL_ROUTE, { waitUntil: "domcontentloaded" });

    await fillField(page, "websiteUrl", "example.com");
    await fillField(page, "campaignSource", "facebook");
    await fillField(page, "campaignMedium", "Podcast");
    await fillField(page, "campaignName", "Awareness");

    await page.getByRole("button", { name: /add parameter/i }).click();
    await page.locator('input[placeholder="utm_custom"]').fill("utm_campaign");
    await page.locator('input[placeholder="value"]').fill("override");
    await page.getByRole("button", { name: /copy url/i }).click();

    await expect(
      page.getByText(
        "Use a GA4 channel medium like email, cpc, paid-social, social, or referral",
      ),
    ).toBeVisible();
    await expect(page.getByText("Use the dedicated field for this parameter")).toBeVisible();
  });
});
