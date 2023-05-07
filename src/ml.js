const dotenv = require("dotenv");
require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");

dotenv.config();

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
  await new Promise((resolve) => setTimeout(resolve, 4000)); // wait for 4 seconds to avoid rate limit
  return result;
};
