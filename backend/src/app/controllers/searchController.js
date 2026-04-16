const { quranEng, quranBangla, quranArabic } = require("../utils/quranData");

const searchAyahs = (req, res) => {
  const query = req.query.q?.toLowerCase();
  const lang = req.query.lang || "eng"; // default English

  if (!query) return res.status(400).json({ error: "Query missing" });

  let dataset;
  if (lang === "eng") dataset = quranEng;
  else if (lang === "ban") dataset = quranBangla;
  else if (lang === "arb") dataset = quranArabic;
  else return res.status(400).json({ error: "Invalid language" });

  const results = dataset
    .filter(a => a.text.toLowerCase().includes(query))
    .map(a => ({
      surah: a.sura,
      aya: a.aya,
      text: a.text
    }));

  res.json(results);
};

module.exports = { searchAyahs };