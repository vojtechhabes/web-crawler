const dotenv = require("dotenv");
require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");

dotenv.config();

module.exports.getEmbeddings = async function (data) {
  const model = await use.load();
  const sentences = data;
  const embeddings = await model.embed(sentences);
  let result = embeddings.arraySync()[0];
  return result;
};
