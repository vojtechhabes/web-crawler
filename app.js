import * as crawler from "./crawler.js";
import dotenv from "dotenv";

dotenv.config();

await firestore.initializeFirebaseApp();

const headers = {
  "User-Agent": process.env.USER_AGENT,
};

async function crawl(db, url, headers) {
  console.log("Crawling: " + url);
  try {
    /*
    const websiteData = await firestore.getDataAboutWebsite(url, headers);

    const websiteDataToWrite = JSON.parse(JSON.stringify(websiteData));
    if (process.env.SAVE_LINKS == "false") {
      websiteDataToWrite.links = [];
    }
    if (process.env.SAVE_HEADINGS == "false") {
      websiteDataToWrite.headings = [];
    }

    await firestore.writeEntry(
      db,
      process.env.CRAWLED_COLLECTION_NAME,
      websiteDataToWrite
    );

    await firestore.addLinksToQueue(
      db,
      process.env.QUEUE_COLLECTION_NAME,
      websiteData.links
    );
*/
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

crawl(db, "https://www.alza.cz", headers);
