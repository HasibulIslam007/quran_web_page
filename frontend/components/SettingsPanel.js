import { X } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";

export default function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onChange,
  translationLanguage,
  onTranslationLanguageChange,
}) {
  const mergedSettings = {
    arabicFont: "Amiri",
    arabicSize: 24,
    translationSize: 18,
    decorativeCards: true,
    ...settings,
  };

  const updateSetting = (patch) => {
    onChange?.({ ...mergedSettings, ...patch });
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close settings panel"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/35"
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-sm transform overflow-y-auto border-l border-slate-200 bg-slate-50 p-4 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Reading Settings</h2>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onClose}
            aria-label="Close settings panel"
            className="rounded-xl hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Card className="border border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="arabic-font" className="text-sm font-medium text-slate-700">
                Arabic Font
              </label>
              <select
                id="arabic-font"
                value={mergedSettings.arabicFont}
                onChange={(event) => updateSetting({ arabicFont: event.target.value })}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="Amiri">Amiri</option>
                <option value="Scheherazade">Scheherazade</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-700">
                <label htmlFor="arabic-size" className="font-medium">
                  Arabic Font Size
                </label>
                <span>{mergedSettings.arabicSize}px</span>
              </div>
              <Input
                id="arabic-size"
                type="range"
                min={18}
                max={56}
                step={1}
                value={mergedSettings.arabicSize}
                onChange={(event) => updateSetting({ arabicSize: Number(event.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-700">
                <label htmlFor="translation-size" className="font-medium">
                  Translation Font Size
                </label>
                <span>{mergedSettings.translationSize}px</span>
              </div>
              <Input
                id="translation-size"
                type="range"
                min={14}
                max={36}
                step={1}
                value={mergedSettings.translationSize}
                onChange={(event) => updateSetting({ translationSize: Number(event.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Translation Language</p>
              <div className="flex items-center gap-2">
                <Toggle
                  variant="outline"
                  pressed={translationLanguage === "eng"}
                  onPressedChange={(pressed) => {
                    if (pressed) onTranslationLanguageChange?.("eng");
                  }}
                  aria-label="Use English translation"
                >
                  English
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={translationLanguage === "ban"}
                  onPressedChange={(pressed) => {
                    if (pressed) onTranslationLanguageChange?.("ban");
                  }}
                  aria-label="Use Bangla translation"
                >
                  Bangla
                </Toggle>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Decorations</p>
              <Toggle
                variant="outline"
                pressed={Boolean(mergedSettings.decorativeCards)}
                onPressedChange={(pressed) => updateSetting({ decorativeCards: pressed })}
                aria-label="Toggle decorative card styling"
              >
                Decorative Cards
              </Toggle>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}