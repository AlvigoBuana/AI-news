// Tambahkan 'hideButton = false' sebagai prop baru
export default function SearchBar({ value, onChange, onSearch, loading, hideButton = false }) {
  const onKey = (e) => e.key === "Enter" && onSearch();

  return (
    <div className="w-full flex justify-center">
      <div className="flex w-full max-w-2xl gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search AI news..."
          className="flex-1 px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        {/* Tombol Search sekarang hanya akan muncul jika hideButton bernilai false */}
        {!hideButton && (
          <button
            onClick={onSearch}
            disabled={loading}
            className="flex items-center justify-center px-4 md:px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span className="hidden md:inline ml-2">
              {loading ? "Searching..." : "Search"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}