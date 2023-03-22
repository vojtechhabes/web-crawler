import * as firestore from "./firestore.js";
import dotenv from "dotenv";

dotenv.config();

await firestore.initializeFirebaseApp();

const headers = {
  "User-Agent": process.env.USER_AGENT,
};

async function crawl(db, url, headers) {
  console.log("Crawling: " + url);
  try {
    const websiteData = await firestore.getDataAboutWebsite(url, headers);

    await firestore.writeEntry(
      db,
      process.env.CRAWLED_COLLECTION_NAME,
      websiteData
    );

    await firestore.addLinksToQueue(
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

const db = firestore.getDb();
db.settings({
  ignoreUndefinedProperties: process.env.IGNORE_UNDEFINED_PROPERTIES,
});

crawl(db, "https://www.alza.cz", headers);
