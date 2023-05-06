const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");

dotenv.config();

module.exports.getOldestEntry = async function (pool, tableName, sortField) {
  try {
    const client = await pool.connect();
    const query = {
      text: `SELECT * FROM ${tableName} ORDER BY ${sortField} ASC LIMIT 1`,
    };
    const result = await client.query(query);
    if (result.rows.length === 0) {
      return null;
    }
    client.release();
    return result.rows[0];
  } catch (error) {
    throw new Error(
      `Error getting oldest entry from ${tableName}: ${error.message}`
    );
  }
};

module.exports.writeCrawledWebsite = async function (pool, tableName, data) {
  try {
    const client = await pool.connect();
    const checkQuery = {
      text: `SELECT * FROM ${tableName} WHERE url = $1`,
      values: [data.websiteDetails.url],
    };
    const checkResult = await client.query(checkQuery);
    if (checkResult.rows.length > 0) {
      throw new Error(
        `Website ${data.websiteDetails.url} already exists in the database`
      );
    }
    const query = {
      text: `INSERT INTO ${tableName}(url, title, description, keywords, headings, links, texts) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      values: [
        data.websiteDetails.url,
        data.websiteDetails.title,
        data.websiteDetails.description,
        data.websiteDetails.keywords,
        data.headings,
        data.links,
        data.texts,
      ],
    };
    await client.query(query);
    client.release();
    return;
  } catch (error) {
    throw new Error("Error writing entry: " + error.message);
  }
};

module.exports.deleteEntryById = async function (pool, tableName, id) {
  try {
    const client = await pool.connect();
    const query = {
      text: `DELETE FROM ${tableName} WHERE id = $1`,
      values: [id],
    };
    await client.query(query);
    client.release();
    return;
  } catch (error) {
    throw new Error("Error deleting entry: " + error.message);
  }
};

module.exports.addLinksToQueue = async function (pool, tableName, data) {
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
};

module.exports.getDataAboutWebsite = async function (url, headers) {
  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    let title = $("title").text();
    if (title == null) {
      title = "";
    }
    let description = $('meta[name="description"]').attr("content");
    if (description == null) {
      description = "";
    }
    let keywords = $('meta[name="keywords"]').attr("content");
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

    let links = [];
    $("a").each((i, link) => {
      let href = $(link).attr("href");

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

    let headings = [];
    $("h1, h2, h3, h4, h5, h6").each((i, heading) => {
      let text = $(heading).text();
      if (text == null) {
        return;
      }
      headings.push(text);
    });

    let texts = [];
    $("p").each((i, text) => {
      let textContent = $(text).text();
      if (textContent == null) {
        return;
      }
      texts.push(textContent);
    });

    const data = {
      websiteDetails,
      headings,
      texts,
      links,
    };

    return data;
  } catch (error) {
    throw new Error("Error getting data about website: " + error.message);
  }
};

module.exports.getEmbeddings = async function (data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result[0];
};
