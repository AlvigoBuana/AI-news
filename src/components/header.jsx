import { useState } from "react";
import SearchBar from "./searchbar";

export default function Header({
  searchQuery,
  onSearchChange,
  onSearch,
  loading,
  onGoHome,
  theme,
  toggleTheme,
}) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <div className="hidden sm:flex items-center justify-between w-full gap-4">
            <div className="flex-shrink-0">
              <button onClick={onGoHome} className="text-left">
                <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300">
                  AI News Portal
                </span>
              </button>
            </div>
            <div className="flex-1 flex justify-center px-4">
              <div className="w-full max-w-lg">
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  onSearch={onSearch}
                  loading={loading}
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg text-sm border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Toggle theme"
                title="Toggle light/dark"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
            </div>
          </div>

          <div className="sm:hidden flex items-center justify-between w-full">
            {!isSearchVisible && (
              <>
                <button onClick={onGoHome} className="text-left">
                  <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300">
                    AI News
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSearchVisible(true)}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label="Open search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? "🌙" : "☀️"}
                  </button>
                </div>
              </>
            )}
            {isSearchVisible && (
              <div className="flex items-center w-full gap-2">
                <div className="flex-1">
                   <SearchBar
                      value={searchQuery}
                      onChange={onSearchChange}
                      onSearch={onSearch}
                      loading={loading}
                   />
                </div>
                <button 
                  onClick={() => setIsSearchVisible(false)}
                  className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}