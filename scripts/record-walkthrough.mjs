import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const VIDEOS_DIR = path.resolve("./public/videos");
const TEMP_RECORDING_DIR = path.resolve("./public/videos/temp");

async function record() {
  console.log(`🎬 Starting Walkthrough Video Recording from ${BASE_URL}...`);

  if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  }
  if (!fs.existsSync(TEMP_RECORDING_DIR)) {
    fs.mkdirSync(TEMP_RECORDING_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: TEMP_RECORDING_DIR,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  // Helper for smooth scrolling
  async function smoothScroll(distance, step = 40, delay = 20) {
    try {
      let scrolled = 0;
      while (scrolled < distance) {
        await page.evaluate((s) => window.scrollBy(0, s), step);
        scrolled += step;
        await page.waitForTimeout(delay);
      }
    } catch (e) {
      console.log("Scroll caught context shift:", e.message);
    }
  }

  async function smoothScrollToTop(step = 40, delay = 20) {
    try {
      const currentY = await page.evaluate(() => window.scrollY);
      let y = currentY;
      while (y > 0) {
        await page.evaluate((s) => window.scrollBy(0, -s), step);
        y -= step;
        await page.waitForTimeout(delay);
      }
    } catch (e) {
      console.log("Scroll caught context shift:", e.message);
    }
  }

  // --- 1. Public Home Page ---
  console.log("1. Demonstrating Public Home Page...");
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await smoothScroll(600, 30, 25);
  await page.waitForTimeout(1000);
  await smoothScrollToTop(35, 20);
  await page.waitForTimeout(1000);

  // --- 2. About Project Page ---
  console.log("2. Demonstrating About Project Page...");
  await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await smoothScroll(700, 35, 20);
  await page.waitForTimeout(1000);
  await smoothScroll(600, 35, 20);
  await page.waitForTimeout(1200);
  await smoothScrollToTop(40, 20);
  await page.waitForTimeout(1000);

  // --- 3. Projects Page ---
  console.log("3. Demonstrating Projects Page...");
  await page.goto(`${BASE_URL}/projects`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await smoothScroll(500, 35, 20);
  await page.waitForTimeout(1500);

  // --- 4. Login Page ---
  console.log("4. Demonstrating Login Page...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // --- 5. Register Page ---
  console.log("5. Demonstrating Register Page...");
  await page.goto(`${BASE_URL}/signup`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await smoothScroll(300, 30, 20);
  await page.waitForTimeout(1000);

  // --- 6. Forgot Password ---
  console.log("6. Demonstrating Forgot Password Flow...");
  await page.goto(`${BASE_URL}/forgot-password`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await page.fill('input[type="email"]', "manvi@company.com");
  await page.waitForTimeout(1000);

  // --- 7. Employee Dashboard ---
  console.log("7. Logging in as Employee...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await page.fill('input[type="email"]', "manvi@company.com");
  await page.fill('input[type="password"]', "emp123");
  await page.waitForTimeout(600);
  await page.click('button[type="submit"]');
  await page.waitForURL(`**/dashboard`, { timeout: 15000 });
  await page.waitForTimeout(2000);

  // --- 8. Access Directory ---
  console.log("8. Demonstrating Access Directory Search...");
  const searchInput = page.locator('input[placeholder*="Search by board"]');
  if (await searchInput.isVisible()) {
    await searchInput.fill("Monday");
    await page.waitForTimeout(1200);
    await searchInput.fill("");
    await page.waitForTimeout(800);
  }

  // --- 9. View Access Details ---
  console.log("9. Viewing Access Item Details...");
  const catalogItem = page.locator('.result-row, .board-card, div:has-text("Marketing Operations Board")').first();
  if (await catalogItem.isVisible()) {
    await catalogItem.click();
    await page.waitForTimeout(1800);
  }

  // --- 10. Request Access ---
  console.log("10. Requesting Access...");
  const requestBtn = page.locator('button:has-text("Request Access"), button:has-text("Request Board Access")').first();
  if (await requestBtn.isVisible()) {
    await requestBtn.click();
    await page.waitForTimeout(1200);
    const textarea = page.locator("textarea");
    if (await textarea.isVisible()) {
      await textarea.fill("Need access for upcoming Q3 campaign execution.");
      await page.waitForTimeout(1000);
    }
  }

  // Close any open drawer
  const closeBtn = page.locator('button[aria-label="Close"], button:has-text("Cancel"), button:has-text("✕")').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  // --- 11. My Requests ---
  console.log("11. Demonstrating My Requests Section...");
  await smoothScroll(400, 30, 20);
  await page.waitForTimeout(1500);

  // --- 12. Board Admin View ---
  console.log("12. Switching to Board Admin View...");
  await smoothScrollToTop(40, 20);
  await page.waitForTimeout(800);
  const adminSwitchBtn = page.locator('button:has-text("Board Admin View")');
  if (await adminSwitchBtn.isVisible()) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }).catch(() => {}),
      adminSwitchBtn.click(),
    ]);
    await page.waitForTimeout(2500);
  }

  // --- 13. Approve / Reject Request ---
  console.log("13. Demonstrating Quick Approvals & Queue...");
  await smoothScroll(500, 30, 20);
  await page.waitForTimeout(1500);

  // --- 14. Automated Provisioning ---
  console.log("14. Showing Automated Boards & Automation Toggles...");
  await smoothScroll(400, 30, 20);
  await page.waitForTimeout(1500);

  // --- 15. Manual Provisioning Queue ---
  console.log("15. Showing Admin Manual Provisioning Queue...");
  await smoothScroll(400, 30, 20);
  await page.waitForTimeout(1500);

  // --- 16. Recent Activity & Time Filters ---
  console.log("16. Demonstrating Recent Activity & History Filters...");
  await smoothScroll(500, 30, 20);
  await page.waitForTimeout(1000);
  
  // Click 7 Days filter
  const filter7d = page.locator('button:has-text("Past 7 Days"), button:has-text("7 Days"), button:has-text("7d")').first();
  if (await filter7d.isVisible()) {
    await filter7d.click();
    await page.waitForTimeout(1000);
  }

  // Click 21 Days filter
  const filter21d = page.locator('button:has-text("Past 21 Days"), button:has-text("21 Days"), button:has-text("21d")').first();
  if (await filter21d.isVisible()) {
    await filter21d.click();
    await page.waitForTimeout(1000);
  }

  // Click All Time filter
  const filterAll = page.locator('button:has-text("All Time"), button:has-text("All")').first();
  if (await filterAll.isVisible()) {
    await filterAll.click();
    await page.waitForTimeout(1000);
  }

  // --- 17. Part 4 / Submission Summary ---
  console.log("17. Navigating to About Page for Submission Summary...");
  await page.goto(`${BASE_URL}/about`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await smoothScroll(1100, 35, 20);
  await page.waitForTimeout(2500);

  console.log("Finishing video session...");
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video file in temp dir
  const tempFiles = fs.readdirSync(TEMP_RECORDING_DIR).filter((f) => f.endsWith(".webm"));
  if (tempFiles.length === 0) {
    throw new Error("No recording file generated by Playwright.");
  }

  const recordedWebmPath = path.join(TEMP_RECORDING_DIR, tempFiles[0]);
  const targetWebmPath = path.join(VIDEOS_DIR, "walkthrough.webm");
  const targetMp4Path = path.join(VIDEOS_DIR, "walkthrough.mp4");

  // Copy to walkthrough.webm
  fs.copyFileSync(recordedWebmPath, targetWebmPath);
  console.log(`✅ Saved WebM recording to: ${targetWebmPath}`);

  // Convert to highly compatible fast-start MP4 with ffmpeg
  console.log("Encoding optimized MP4 version with ffmpeg...");
  try {
    execSync(
      `/opt/homebrew/bin/ffmpeg -y -i "${targetWebmPath}" -c:v libx264 -pix_fmt yuv420p -preset fast -movflags +faststart "${targetMp4Path}"`,
      { stdio: "inherit" }
    );
    console.log(`✅ Generated MP4 walkthrough at: ${targetMp4Path}`);
  } catch (e) {
    console.warn("FFmpeg conversion notice:", e.message);
  }

  // Clean up temp dir
  fs.rmSync(TEMP_RECORDING_DIR, { recursive: true, force: true });
  console.log("🎉 Complete walkthrough recording process finished successfully!");
}

record().catch((err) => {
  console.error("Recording error:", err);
  process.exit(1);
});
