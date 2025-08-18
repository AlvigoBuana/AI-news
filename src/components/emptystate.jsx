// src/components/emptystate.jsx
export default function EmptyState({ message = "No news found." }) {
  return (
    <div className="col-span-full text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold mb-1">Nothing to see here</h3>
      <p className="text-zinc-500">{message}</p>
    </div>
  );
}
