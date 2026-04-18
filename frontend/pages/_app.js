import "../app/globals.css";
import { useEffect } from "react";
import { Amiri, Scheherazade_New } from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-amiri",
});

const scheherazadeNew = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-scheherazade",
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const applyTheme = () => {
      const isDark = localStorage.getItem("darkMode") === "true";
      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme();
    window.addEventListener("quran-theme-change", applyTheme);
    window.addEventListener("storage", applyTheme);

    return () => {
      window.removeEventListener("quran-theme-change", applyTheme);
      window.removeEventListener("storage", applyTheme);
    };
  }, []);

  return (
    <div className={`${amiri.variable} ${scheherazadeNew.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
