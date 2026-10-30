import { test, expect } from "@playwright/test";

async function measureMidSlide(page, targetPath = "/maps") {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "load" });
  await page.waitForFunction(() => {
    const el = document.querySelector(".nav-tabs-indicator");
    if (!el) return false;
    const tx = new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
    return (
      el.classList.contains("nav-tabs-indicator--ready") ||
      tx > 0.5
    );
  });

  const indicator = page.locator(".nav-tabs-indicator");

  const readTx = () =>
    indicator.evaluate((el) => {
      const t = getComputedStyle(el).transform;
      if (!t || t === "none") return 0;
      return new DOMMatrixReadOnly(t).m41;
    });

  const startTx = await readTx();
  const endTx = await page.evaluate((path) => {
    const link = document.querySelector(`a[data-tab-path="${path}"]`);
    return link ? link.offsetLeft : 0;
  }, targetPath);

  const midPromise = page.waitForFunction(
    ({ start, end }) => {
      const el = document.querySelector(".nav-tabs-indicator");
      if (!el) return false;
      const tx = new DOMMatrixReadOnly(getComputedStyle(el).transform).m41;
      return tx > start + 1 && tx < end - 1;
    },
    { start: startTx, end: endTx },
    { timeout: 5000 }
  );

  await page.locator(`a[data-tab-path="${targetPath}"]`).click({
    noWaitAfter: true,
  });

  await midPromise;
  const midTx = await readTx();

  return { startTx, endTx, midTx };
}

test("tab indicator translateX is mid-slide", async ({ page }, testInfo) => {
  const label = testInfo.project.name;
  const { startTx, endTx, midTx } = await measureMidSlide(page);

  console.log(`[${label}] startTx=${startTx} midTx=${midTx} endTx=${endTx}`);

  expect(endTx).toBeGreaterThan(startTx + 20);
  expect(midTx).toBeGreaterThan(startTx + 1);
  expect(midTx).toBeLessThan(endTx - 1);
});
