export default function SortControls({ sortBy, onSortChange }) {
  const buttonStyle = "px-4 py-1.5 rounded-full text-sm font-medium transition-colors";
  const activeStyle = "bg-indigo-600 text-white";
  const inactiveStyle = "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700";

  return (
    <div className="flex items-center justify-end gap-2 mb-4">
      <span className="text-sm text-zinc-500">Sort by:</span>
      <button
        onClick={() => onSortChange('newest')}
        className={`${buttonStyle} ${sortBy === 'newest' ? activeStyle : inactiveStyle}`}
      >
        Latest
      </button>
      <button
        onClick={() => onSortChange('popularity')}
        className={`${buttonStyle} ${sortBy === 'popularity' ? activeStyle : inactiveStyle}`}
      >
        Trending
      </button>
    </div>
  );
}