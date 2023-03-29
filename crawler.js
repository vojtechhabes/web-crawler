import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

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
    const query = collectionRef.where(
      "websiteDetails.url",
      "==",
      data.websiteDetails.url
    );
    const querySnapshot = await query.get();
    if (!querySnapshot.empty) {
      throw new Error(
        `Entry with url ${data.websiteDetails.url} already exists.`
      );
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

export async function addLinksToQueue(db, collectionName, data) {
  try {
    const collectionRef = db.collection(collectionName);
    await data.forEach(async (link) => {
      await collectionRef.add({
        url: link,
      });
    });
    return;
  } catch (error) {
    throw new Error("Error while adding links to queue: " + error.message);
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

    const websiteDetails = {
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

    var headings = [];
    $("h1, h2, h3, h4, h5, h6").each((i, heading) => {
      var text = $(heading).text();
      if (text == null) {
        return;
      }
      headings.push(text);
    });

    const data = {
      websiteDetails,
      headings,
      links,
    };

    return data;
  } catch (error) {
    throw new Error("Error getting data about website: " + error.message);
  }
}
