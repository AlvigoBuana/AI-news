// src/components/skeletoncard.jsx
export default function SkeletonCard() {
  return (
    <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
      <div className="h-40 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-3" />
      <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
      <div className="h-5 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
      <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
    </div>
  );
}
