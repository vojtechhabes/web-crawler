import * as firestore from "./firestore.js";
import dotenv from "dotenv";

dotenv.config();

await firestore.initializeFirebaseApp();

const headers = {
  "User-Agent": process.env.USER_AGENT,
};

async function main() {
  const db = firestore.getDb();

  try {
    const websiteData = await firestore.getDataAboutWebsite(
      "https://www.alza.cz",
      headers
    );

    const websiteDescription = websiteData.websiteDescription;

    await firestore.writeEntry(
      db,
      process.env.CRAWLED_COLLECTION_NAME,
      websiteDescription
    );
  } catch (error) {
    console.error(error);
    return;
  }
}

main();
