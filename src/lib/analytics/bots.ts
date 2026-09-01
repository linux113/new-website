/** Cheap UA filter — skip known crawlers/prefetchers from traffic counts. */

const BOT_HINTS = [
  "bot",
  "spider",
  "crawler",
  "crawl",
  "slurp",
  "bingpreview",
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "embedly",
  "preview",
  "headless",
  "phantom",
  "puppeteer",
  "playwright",
  "lighthouse",
  "pagespeed",
  "gtmetrix",
  "pingdom",
  "curl/",
  "wget/",
  "python-requests",
  "axios/",
  "go-http-client",
  "httpclient",
  "libwww",
  "scrapy",
  "node-fetch",
  "undici",
];

export function isBotUserAgent(ua: string | null): boolean {
  if (!ua) return true;
  const lower = ua.toLowerCase();
  if (lower.length < 12) return true;
  return BOT_HINTS.some((hint) => lower.includes(hint));
}
