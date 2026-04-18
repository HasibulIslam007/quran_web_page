import { useState } from "react";
import Link from "next/link";
import { Settings, Menu, X } from "lucide-react";

import { Button } from "./ui/button";

export default function Header({ onToggleSettings, isSettingsOpen = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSettingsClick = (event) => {
    event.preventDefault();
    onToggleSettings?.();
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo / Title */}
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-700 cursor-pointer">
            Quran Web App
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium">
            Home
          </Link>
          <Link href="/search" className="text-gray-700 hover:text-blue-700 font-medium">
            Search
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium">
            About
          </Link>
          <Button
            onClick={handleSettingsClick}
            variant={isSettingsOpen ? "default" : "outline"}
            size="icon"
            className="rounded-xl"
            aria-label="Open settings"
            type="button"
            aria-pressed={isSettingsOpen}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <Button
            onClick={handleSettingsClick}
            variant={isSettingsOpen ? "default" : "outline"}
            size="icon"
            className="rounded-xl"
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
            className="rounded-xl"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Home</Link>
          <Link href="/search" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Search</Link>
          <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">About</Link>
        </nav>
      )}
    </header>
  );
}