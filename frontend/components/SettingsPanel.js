import { useState, useEffect } from "react";

export default function SettingsPanel({ onChange }) {
  const [arabicFont, setArabicFont] = useState("Amiri");
  const [arabicSize, setArabicSize] = useState(24);
  const [translationSize, setTranslationSize] = useState(18);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedArabicFont = localStorage.getItem("arabicFont");
    const savedArabicSize = Number(localStorage.getItem("arabicSize"));
    const savedTranslationSize = Number(localStorage.getItem("translationSize"));

    if (savedArabicFont) setArabicFont(savedArabicFont);
    if (Number.isFinite(savedArabicSize) && savedArabicSize > 0) setArabicSize(savedArabicSize);
    if (Number.isFinite(savedTranslationSize) && savedTranslationSize > 0) {
      setTranslationSize(savedTranslationSize);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("arabicFont", arabicFont);
    localStorage.setItem("arabicSize", arabicSize);
    localStorage.setItem("translationSize", translationSize);
    onChange({ arabicFont, arabicSize, translationSize });
  }, [arabicFont, arabicSize, translationSize, onChange]);

  return (
    <div className="p-4 bg-gray-100 rounded shadow mb-6">
      <h2 className="font-bold mb-2">Settings</h2>

      {/* Arabic Font */}
      <div className="mb-2">
        <label className="mr-2">Arabic Font:</label>
        <select value={arabicFont} onChange={(e) => setArabicFont(e.target.value)} className="border rounded p-1">
          <option value="Amiri">Amiri</option>
          <option value="Scheherazade">Scheherazade</option>
        </select>
      </div>

      {/* Arabic Font Size */}
      <div className="mb-2">
        <label className="mr-2">Arabic Font Size:</label>
        <input
          type="number"
          value={arabicSize}
          min={16}
          max={48}
          onChange={(e) => setArabicSize(Number(e.target.value) || 24)}
          className="border rounded p-1 w-16"
        /> px
      </div>

      {/* Translation Font Size */}
      <div className="mb-2">
        <label className="mr-2">Translation Font Size:</label>
        <input
          type="number"
          value={translationSize}
          min={14}
          max={36}
          onChange={(e) => setTranslationSize(Number(e.target.value) || 18)}
          className="border rounded p-1 w-16"
        /> px
      </div>
    </div>
  );
}