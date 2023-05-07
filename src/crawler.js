const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
const huggingface = require("./ml.js");
const { json } = require("express");
var xss = require("xss");

dotenv.config();

module.exports.getOldestEntry = async function (pool, tableName, sortField) {
  console.log(`ℹ️ Getting oldest entry from ${tableName}`);
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
  console.log(`ℹ️ Writing entry to ${tableName}`);
  try {
    const client = await pool.connect();
    const checkQuery = {
      text: `SELECT * FROM ${tableName} WHERE url = $1`,
      values: [data.url],
    };
    const checkResult = await client.query(checkQuery);
    if (checkResult.rows.length > 0) {
      throw new Error(`Website ${data.url} already exists in the database`);
    }
    const query = {
      text: `INSERT INTO ${tableName}(url, title, description, keywords, content, links, embeddings) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      values: [
        data.url,
        data.title,
        data.description,
        data.keywords,
        data.content,
        data.links,
        JSON.stringify(data.embeddings),
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
  console.log(`ℹ️ Deleting entry from ${tableName}`);
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
  console.log(`ℹ️ Adding links to ${tableName}`);
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
  console.log(`ℹ️ Getting data about website ${url}`);
  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    let title = $("title").text();
    if (title == null) {
      title = "";
    }
    title = xss(title);

    let description = $('meta[name="description"]').attr("content");
    if (description == null) {
      description = "";
    }
    description = xss(description);

    let keywords = $('meta[name="keywords"]').attr("content");
    if (keywords == null) {
      keywords = "";
    }
    keywords = xss(keywords);

    url = response.request.res.responseUrl;
    url = xss(url);

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

      href = xss(href);
      links.push(href);
    });

    let content = "";
    $("h1, h2, h3, h4, h5, h6, p").each((i, text) => {
      let textContent = $(text).text();
      if (textContent == null) {
        return;
      }
      content += textContent + " ";
    });
    content = xss(content);

    let embeddings = await huggingface.getEmbeddings(
      `${url}\n\n${title}\n\n${content}`
    );

    if (description == "") {
      $("p").each((i, text) => {
        let textContent = $(text).text();
        if (textContent == null) {
          return;
        }
        if (description.length < 200) {
          description += textContent;
        }
      });

      if (description.length > 200) {
        description = description.substring(0, 200);
      }

      if (description == "") {
        description = "Description for this website is not available.";
      }
    }

    description = description.replace(/(\r\n|\n|\r)/gm, " ");

    const data = {
      url,
      title,
      description,
      keywords,
      content,
      links,
      embeddings,
    };

    return data;
  } catch (error) {
    throw new Error("Error getting data about website: " + error.message);
  }
};
