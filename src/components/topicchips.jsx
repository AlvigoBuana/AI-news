export default function TopicChips({ topics, active, onPick }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {topics.map((t) => {
        const isActive = active?.toLowerCase() === t.toLowerCase();
        return (
          <button
            key={t}
            onClick={() => onPick(t)}
            className={
              // --- PERUBAHAN: Tambah animasi klik 'active:scale-95' ---
              "px-3 py-1.5 rounded-full text-sm border transition-transform active:scale-95 " +
              (isActive
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800")
            }
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}