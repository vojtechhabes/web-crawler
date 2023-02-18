import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import serviceAccountKey from "./serviceAccountKey.json" assert { type: "json" };

dotenv.config();

export async function initializeFirebaseApp() {
  try {
    initializeApp({
      credential: cert(serviceAccountKey),
    });
  } catch (error) {
    throw new Error("Error initializing Firebase: " + error.message);
  }
}

export function getDb() {
  const db = getFirestore();
  return db;
}

export async function getOldestEntry(db, collectionName, sortField) {
  try {
    const collectionRef = db.collection(collectionName);
    const query = collectionRef.orderBy(sortField).limit(1);
    const querySnapshot = await query.get();
    if (querySnapshot.empty) {
      throw new Error(
        "No matching documents found for query: " + JSON.stringify(query)
      );
    }
    const oldestDoc = querySnapshot.docs[0];
    return oldestDoc;
  } catch (error) {
    throw new Error("Error getting oldest entry: " + error.message);
  }
}

export async function writeEntry(db, collectionName, data) {
  try {
    const collectionRef = db.collection(collectionName);
    const query = collectionRef.where("url", "==", data.url);
    const querySnapshot = await query.get();
    if (!querySnapshot.empty) {
      throw new Error("Entry already exists: " + JSON.stringify(data));
    }
    data.timestamp = FieldValue.serverTimestamp();
    const docRef = await collectionRef.add(data);
    return docRef;
  } catch (error) {
    throw new Error("Error writing entry: " + error.message);
  }
}

export async function deleteEntry(db, collectionName, entry) {
  try {
    const collectionRef = db.collection(collectionName);
    const docRef = collectionRef.doc(entry.id);
    await docRef.delete();
    return docRef;
  } catch (error) {
    throw new Error("Error deleting entry: " + error.message);
  }
}

export async function getDataAboutWebsite(url, headers) {
  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    var title = $("title").text();
    if (title == null) {
      title = "";
    }
    var description = $('meta[name="description"]').attr("content");
    if (description == null) {
      description = "";
    }
    var keywords = $('meta[name="keywords"]').attr("content");
    if (keywords == null) {
      keywords = "";
    }
    url = response.request.res.responseUrl;

    const websiteDescription = {
      url,
      title,
      description,
      keywords,
    };

    var links = [];
    $("a").each((i, link) => {
      var href = $(link).attr("href");

      if (href == null) {
        return;
      }

      if (href.startsWith("/") && !href.startsWith("//")) {
        const parsedUrl = new URL(url);
        href = `${parsedUrl.protocol}//${parsedUrl.host}${href}`;
      }

      if (href.startsWith("#")) {
        return;
      }

      if (href.startsWith("mailto:")) {
        return;
      }

      if (href.startsWith("tel:")) {
        return;
      }

      if (href.startsWith("javascript:")) {
        return;
      }

      if (href.startsWith("//")) {
        const parsedUrl = new URL(url);
        href = `${parsedUrl.protocol}${href}`;
      }

      links.push(href);
    });
    const data = {
      websiteDescription,
      links,
    };
    return data;
  } catch (error) {
    throw new Error("Error getting data about website: " + error.message);
  }
}
