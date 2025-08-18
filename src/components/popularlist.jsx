export default function PopularList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((news, i) => (
        <a
          key={i}
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 group p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <div className="text-xl font-bold text-zinc-400 dark:text-zinc-600">
            {String(i + 1).padStart(2, "0")}
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-semibold line-clamp-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {news.title}
            </h4>
            {/* DIUBAH: Warna teks dibuat sedikit lebih terang agar mudah dibaca */}
            <p className="text-xs text-zinc-400 mt-1">
              {news.source || "Unknown"}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}