export const normalizeArabicFont = (fontValue) => {
  const raw = String(fontValue || "").toLowerCase();
  if (raw.includes("scheherazade")) return "Scheherazade New";
  return "Amiri";
};

export const getArabicFontStack = (fontValue) => {
  const normalized = normalizeArabicFont(fontValue);
  if (normalized === "Scheherazade New") {
    return "var(--font-arabic-scheherazade), var(--font-arabic-amiri), serif";
  }

  return "var(--font-arabic-amiri), serif";
};
