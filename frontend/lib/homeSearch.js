const stripArabicDiacritics = (value) =>
  String(value || "")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/\u0640/g, "");

const normalize = (value) =>
  stripArabicDiacritics(value)
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]"'<>?،؛!?|\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const scoreText = (source, queryText, tokens) => {
  if (!source || !queryText) return 0;

  let score = 0;
  if (source === queryText) score += 300;
  if (source.startsWith(queryText)) score += 180;
  if (source.includes(queryText)) score += 120;

  let matched = 0;
  for (const token of tokens) {
    if (source.includes(token)) matched += 1;
  }

  if (tokens.length && matched === tokens.length) score += 80;
  else score += matched * 20;

  return score;
};

export const rankSurahs = (items, rawQuery, limit = 8) => {
  const queryText = normalize(rawQuery);
  if (!queryText) return [];

  const tokens = queryText.split(" ").filter(Boolean);

  return items
    .map((surah) => {
      const fields = [
        normalize(surah.nameEnglish),
        normalize(surah.nameBangla),
        normalize(surah.nameArabic),
        normalize(`surah ${surah.number}`),
        normalize(String(surah.number)),
      ];

      const score = fields.reduce(
        (maxScore, field) => Math.max(maxScore, scoreText(field, queryText, tokens)),
        0,
      );

      return { ...surah, _score: score };
    })
    .filter((surah) => surah._score > 0)
    .sort((a, b) => b._score - a._score || a.number - b.number)
    .slice(0, limit);
};

export const getLocalizedSurahLabel = (surah, lang) => {
  if (lang === "arb") return surah.nameArabic || "(Arabic not available)";
  if (lang === "ban") return surah.nameBangla || "(Bangla not available)";
  return surah.nameEnglish || "(English not available)";
};
