const fs = require("fs");
const path = require("path");

// Load three datasets
const dataDir = path.resolve(__dirname, "../../../data");

const quranEng = JSON.parse(fs.readFileSync(path.join(dataDir, "ayats_en.json"), "utf8"));
const quranBangla = JSON.parse(fs.readFileSync(path.join(dataDir, "ayats_bn.json"), "utf8"));
const quranArabic = JSON.parse(fs.readFileSync(path.join(dataDir, "ayats_ar.json"), "utf8"));

module.exports = { quranEng, quranBangla, quranArabic };