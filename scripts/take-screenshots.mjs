import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.resolve("./docs/screenshots");

async function capture() {
  console.log(`📸 Taking fresh screenshots from ${BASE_URL}...`);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Landing Page
  console.log("Capturing Landing Page...");
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "01-landing.png") });

  // 2. Login Page
  console.log("Capturing Login Page...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "02-login.png") });

  // 3. Signup Page
  console.log("Capturing Signup Page...");
  await page.goto(`${BASE_URL}/signup`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "03-signup.png") });

  // 4. Authenticated Dashboard (Sign In)
  console.log("Signing in to capture Dashboard...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "manvi@company.com");
  await page.fill('input[type="password"]', "emp123");
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL(`**/dashboard`, { timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "04-dashboard.png") });

  // 5. Board Admin Dashboard View
  console.log("Capturing Board Admin Dashboard View...");
  await page.click('button:has-text("Board Admin View")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "05-admin-dashboard.png") });

  // 6. About Page
  console.log("Capturing About Page...");
  await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "06-about.png") });

  // 7. Projects Page
  console.log("Capturing Projects Page...");
  await page.goto(`${BASE_URL}/projects`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, "07-projects.png") });

  await browser.close();
  console.log("✅ All fresh screenshots successfully captured!");
}

capture().catch((err) => {
  console.error("❌ Screenshot capture failed:", err);
  process.exit(1);
});
