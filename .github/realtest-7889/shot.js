// Fork-only helper for #7889: open the lecture in Chrome, report the image's rendered
// size and save a screenshot of the description.
const puppeteer = require('puppeteer-core');

(async () => {
  const [url, out, label] = process.argv.slice(2);
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  const img = await page.$('.event-description img');
  if (!img) {
    console.log(`${label}: no image found on ${url}`);
    await page.screenshot({ path: out, fullPage: true });
    process.exit(1);
  }
  await page.waitForFunction(() => document.querySelector('.event-description img').complete);
  const r = await img.evaluate((el) => {
    const b = el.getBoundingClientRect();
    return { w: Math.round(b.width), h: Math.round(b.height), nw: el.naturalWidth, nh: el.naturalHeight };
  });
  console.log(`${label}: image shown at ${r.w}x${r.h} (ratio ${(r.w / r.h).toFixed(3)}), file is ${r.nw}x${r.nh} (ratio ${(r.nw / r.nh).toFixed(3)})`);
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
})();
