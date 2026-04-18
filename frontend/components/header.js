import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Settings, Menu, X } from "lucide-react";

import { Button } from "./ui/button";

export default function Header({ onToggleSettings, isSettingsOpen = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useRouter();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Search" },
    { href: "/about", label: "About" },
  ];

  const handleSettingsClick = (event) => {
    event.preventDefault();
    onToggleSettings?.();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/85 dark:shadow-slate-900/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group">
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-slate-900 transition group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300 sm:text-xl">
              Quran Web App
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Read • Search • Reflect</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl bg-slate-100/90 p-1 md:flex dark:bg-slate-800/80">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300"
                    : "text-slate-600 hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            onClick={handleSettingsClick}
            variant={isSettingsOpen ? "default" : "outline"}
            size="icon"
            className="rounded-xl border-slate-300"
            aria-label="Open settings"
            type="button"
            aria-pressed={isSettingsOpen}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            onClick={handleSettingsClick}
            variant={isSettingsOpen ? "default" : "outline"}
            size="icon"
            className="rounded-xl border-slate-300"
            aria-label="Open settings"
            type="button"
            aria-pressed={isSettingsOpen}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-300"
            aria-label="Open menu"
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="mx-4 mb-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-md md:hidden dark:border-slate-700 dark:bg-slate-900">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}