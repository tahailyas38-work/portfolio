import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://localhost:3003", { waitUntil: "domcontentloaded", timeout: 30000 });
await page.evaluate(() => {
  document.documentElement.classList.remove("scroll-locked");
  document.documentElement.classList.add("snap-enabled");
});
await page.waitForTimeout(800);

const data = await page.evaluate(async () => {
  const footer = document.querySelector("footer");
  const contact = document.querySelector("#contact");
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  contact.scrollIntoView({ block: "start" });
  await new Promise((r) => setTimeout(r, 400));
  const atContact = {
    scrollY: window.scrollY,
    footerTop: footer.getBoundingClientRect().top,
    maxScroll,
  };
  for (let i = 0; i < 15; i++) {
    window.scrollBy(0, 300);
    await new Promise((r) => setTimeout(r, 80));
  }
  await new Promise((r) => setTimeout(r, 500));
  const afterWheel = {
    scrollY: window.scrollY,
    footerTop: footer.getBoundingClientRect().top,
    footerBottom: footer.getBoundingClientRect().bottom,
    innerH: window.innerHeight,
  };
  window.scrollTo(0, maxScroll);
  await new Promise((r) => setTimeout(r, 500));
  const atMax = {
    scrollY: window.scrollY,
    footerBottom: footer.getBoundingClientRect().bottom,
    innerH: window.innerHeight,
    reachedEnd: Math.abs(window.scrollY - maxScroll) < 5,
    footerFullyVisible: footer.getBoundingClientRect().bottom <= window.innerHeight + 2,
  };
  return { atContact, afterWheel, atMax, footerClass: footer.className, contactClass: contact.className };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
