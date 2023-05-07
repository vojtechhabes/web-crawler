const crawler = require("./crawler.js");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const headers = {
  "User-Agent": process.env.USER_AGENT,
};

async function crawl(client, url, headers, crawledTable, queueTable) {
  console.log("🧭 Crawling: " + url);
  try {
    const websiteData = await crawler.getDataAboutWebsite(url, headers);

    await crawler.writeCrawledWebsite(client, crawledTable, websiteData);

    await crawler.addLinksToQueue(client, queueTable, websiteData.links);

    console.log(`✅ Crawled: ${url}`);
    return;
  } catch (error) {
    throw new Error(`❗️ Error while crawling ${url}: ${error.message}`);
  }
}

(async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  let oldestEntry;

  while (true) {
    const client = await pool.connect();
    try {
      oldestEntry = await crawler.getOldestEntry(
        client,
        process.env.QUEUE_TABLE,
        "timestamp"
      );

      if (oldestEntry == null) {
        console.log("🫙 Queue is empty");
        break;
      }

      await crawl(
        client,
        oldestEntry.url,
        headers,
        process.env.CRAWLED_TABLE,
        process.env.QUEUE_TABLE
      );
    } catch (error) {
      console.log(error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    await crawler.deleteOldestEntry(
      client,
      process.env.QUEUE_TABLE,
      "timestamp"
    );
    client.release();

    console.log("🕒 Waiting 1 second");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
})();
