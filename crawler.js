const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");

dotenv.config();


module.exports.getOldestEntry = async function(pool, tableName, sortField) {  
  try {
    const client = await pool.connect();
    const query = {
      text: `SELECT * FROM ${tableName} ORDER BY ${sortField} ASC LIMIT 1`,
    };
    const result = await client.query(query);
    if (result.rows.length === 0) {
      throw new Error(
        "No matching documents found for query: " + JSON.stringify(query)
      );
    }
    const oldestDoc = result.rows[0];
    client.release();
    return oldestDoc;
  } catch (error) {
    throw new Error(`Error getting oldest entry from ${tableName}: ${error.message}`);
  }
}


module.exports.writeCrawledWebsite = async function(pool, tableName, data) {
  try {
    const client = await pool.connect();
    const query = {
      text: `INSERT INTO ${tableName}(url, title, description, keywords, headings, links) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [
        data.websiteDetails.url, 
        data.websiteDetails.title, 
        data.websiteDetails.description, 
        data.websiteDetails.keywords, 
        data.headings, 
        data.links
      ],
    };
    await client.query(query);
    client.release();
  } catch (error) {
    throw new Error("Error writing entry: " + error.message);
  }
}

/*
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
*/

module.exports.addLinksToQueue = async function(pool, tableName, data) {
  try {
    const client = await pool.connect();
    await data.forEach(async (link) => {
      const query = {
        text: `INSERT INTO ${tableName}(url) VALUES($1)`,
        values: [link],
      };
      await client.query(query);
    });
    client.release();
    return;
  } catch (error) {
    throw new Error("Error while adding links to queue: " + error.message);
  }
}

module.exports.getDataAboutWebsite = async function(url, headers) {
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
