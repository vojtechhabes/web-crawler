const crawler = require("./crawler.js");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const headers = {
  "User-Agent": process.env.USER_AGENT,
};

async function crawl(db, url, headers) {
  console.log("Crawling: " + url);
  try {
    
    const websiteData = await crawler.getDataAboutWebsite(url, headers);
    /*
    const websiteDataToWrite = JSON.parse(JSON.stringify(websiteData));
    if (process.env.SAVE_LINKS == "false") {
      websiteDataToWrite.links = [];
    }
    if (process.env.SAVE_HEADINGS == "false") {
      websiteDataToWrite.headings = [];
    }
    */
    await crawler.writeEntry(
      pool,
      websiteData
    );
    
    await crawler.addLinksToQueue(
      db,
      process.env.QUEUE_COLLECTION_NAME,
      websiteData.links
    );
    
    console.log(`Crawled: ${url}`);
  } catch (error) {
    console.error(error);
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

crawl(pool, "https://www.alza.cz", headers);
