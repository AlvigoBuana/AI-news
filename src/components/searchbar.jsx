export default function SearchBar({ value, onChange, onSearch, loading }) {
  const onKey = (e) => e.key === "Enter" && onSearch();
  return (
    <div className="w-full flex justify-center">
      <div className="flex w-full max-w-2xl gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search news, figure or topics"
          className="flex-1 px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={onSearch}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
