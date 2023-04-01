const crawler = require("./crawler.js");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const headers = {
  "User-Agent": process.env.USER_AGENT,
};

async function crawl(pool, url, headers) {
  console.log("Crawling: " + url);
  try {
    const websiteData = await crawler.getDataAboutWebsite(url, headers);

    await crawler.writeCrawledWebsite(pool, "crawled", websiteData);

    await crawler.addLinksToQueue(pool, "queue", websiteData.links);

    console.log(`Crawled: ${url}`);
    return;
  } catch (error) {
    console.error(`Error crawling ${url}: ${error}`);
    return;
  }
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async () => {
  while (true) {
    const oldestEntry = await crawler.getOldestEntry(pool, "queue", "timestamp");
    if (oldestEntry instanceof Error) {
      console.error(oldestEntry);
      break;
    }
    await crawl(pool, oldestEntry.url, headers);
    await crawler.deleteEntryById(pool, "queue", oldestEntry.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
})();
